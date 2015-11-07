import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
import java.util.Timer;
import java.net.URL;

import processing.core.PApplet;
import processing.core.PFont;
import ddf.minim.spi.*;
import ddf.minim.signals.*;
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.effects.*;
import processing.serial.*;

/**
 * The main class
 * @author Liang
 */
public class Surus extends PApplet {
	private static final long serialVersionUID = 1L;
	/**
	 * the lock of web server stream
	 */
	static boolean streamLock = false; 
	// The serial port:
	Serial myPort;
	
	int accel_x, accel_y, accel_z;    // data on x, y, z axis

	String inString;  // Input string from serial port
	int lf = 35;      // ASCII linefeed '#'

	int buff_len = 10;        // the buffer length for processing accelerometer data 
	float rms_thred = 3.0f;   // thredshold for data capture

	long timer = 0;   //general purpuse timer
	long timer_old;
	float rms;   // RMS
	float ratio = 100.0f; 
	int counter = 0;   // count the time of accelerometer data collection

	boolean isFull = false;       // flag indicating if the buffer is full
	boolean motionBegin = false;  // flag indicating if the motion starts
	
	int FFTBufferSize = 128;	// the size of buffer for FFT 

	//SoundData[] ss_array = new SoundData[numBuffers];				// RMS array
	//ArrayList<SoundData> FFT_array = new ArrayList<SoundData>();	// FFT ArrayList 
	ArrayList<AccUnit> accBuffer = new ArrayList<AccUnit>();
	ArrayList<AccUnit> accBuffer_process = new ArrayList<AccUnit>();
	
	boolean isGestureDone = false;  // test if the gesture is done

	FFT fft_x;
	FFT fft_y;
	FFT fft_z;
	float[] rollingData_x = new float[FFTBufferSize];				// the buffer for FFT on x-axis
	float[] rollingData_y = new float[FFTBufferSize];				// the buffer for FFT on y-axis
	float[] rollingData_z = new float[FFTBufferSize];				// the buffer for FFT on z-axis
	
	// Machine Learning 
	WekaJ48 DTClassifier;
	String[] classNames = {"idle","shake","thrust","slap_r","slap_l","other"};

	int current_class = 0;										// index of current training class
	ArrayList<String> dataSet = new ArrayList<String>(); 		// store all instances
	
	// Flags for machine learning
	boolean isStartRec = false;
	boolean isTrainingData = false;
	boolean isLiveTesting = false;
	boolean is_save_traing = false;
	
	int insNo = 0;											// count the number of trained instances
	
	// float[] fft_bands_x = new float[FFTBufferSize/2+1];		// store all frequency band of x-axis after FFT
	// float[] fft_bands_y = new float[FFTBufferSize/2+1];		// store all frequency band of y-axis after FFT
	// float[] ftt_bands_z = new float[FFTBufferSize/2+1];		// store all frequency band of z-axis after FFT
    
    int m = 10;			// 1/m is the sample rate, unit: ms
	
	float[] gestureTest_features = new float[16];
	PFont font;
	
	/**
	 * Web Server Communication
	 * @author Ruofei Du
	 * @param inputString consists a command and a power e.g. I means idle, L128 means leftSnap 128, T255 means thrust 255.
	 * @return outputString consists 5 numbers indicating each motor strength
	 */
	public static String getOutputSetInput(String inputString) {
		String res = null; 
		if (streamLock) return null; 
		streamLock = true; 
		try (java.util.Scanner s = new java.util.Scanner(new java.net.URL("http://localhost/ninjaterp/server/?getOutputSetInput=" + inputString).openStream())) {
			res = s.useDelimiter("\\A").next();
	    } catch (Exception e) {
	    } finally {
	    	streamLock = false; 
	    } 
    	return res; 
	}
	
	/**
	 * If the server is locked, do nothing, ignore this function
	 */
	public static void doNothing() {}
	
	/**
	 * Stop All Motors, TODO
	 * @author Liang He
	 */
	public static void stopAllMotors() {
		
	}
	
	/**
	 * Parse the output string and signal motors to do something
	 * @author Liang He
	 * @param s
	 */
	public static void signalMotors(String s) {
		int vibrationMotorStength = 0; 
		int solonoidLeft = 0, solonoidRight = 0; 
		int servo = 0; 
		System.out.println(s);	
		String[] parts = s.split(",");	
		
		vibrationMotorStength = Integer.parseInt(parts[0]);
		solonoidLeft = Integer.parseInt(parts[1]);
		solonoidRight = Integer.parseInt(parts[2]);
		servo = Integer.parseInt(parts[3]);
	}
	
	/**
	 * Test code for the server
	 * @author Ruofei Du
	 */
	public static void testServer() {
		String output = getOutputSetInput("I");  // input can be I, L0, R255, S255, T255;
		if (output == null) doNothing(); else
		if (output.equals("I")) stopAllMotors(); else signalMotors(output);
	}
	
	public void setup(){
		background(0);
		size(300, 50);
		
		background(0);
		  // List all the available serial ports:
		//printArray(Serial.list());
		  // Open the port you are using at the rate you want:
		myPort = new Serial(this, Serial.list()[1], 9600);
		  
		timer = millis();
		delay(20);
		
		/* Initial fft object */
		fft_x = new FFT(FFTBufferSize,100/m);
		fft_y = new FFT(FFTBufferSize,100/m);
		fft_z = new FFT(FFTBufferSize,100/m);
	}

	public void draw(){
		if ((millis() - timer) >= m){   // Main loop runs at 100Hz
			counter++;
		    timer_old = timer;
		    timer = millis();
		    
		    // read accelerometer data on x, y, z axis
		    inString = myPort.readStringUntil(lf);
		    if (inString != null) {
		        inString = inString.substring(0, inString.length()-1);
		        String[] dataSets = inString.split(",");
		        if (dataSets.length == 3) {
		          if (dataSets[0] != "" && dataSets[1] != "" && dataSets[2] != "") {
		            accel_x = Integer.parseInt(dataSets[0]);
		            accel_y = Integer.parseInt(dataSets[1]);
		            accel_z = Integer.parseInt(dataSets[2]);
		            //printData();
		            
		            // store the data into the buffer
		            if(isFull){
		              // remove the earliest one
		              // add a new one
		              accBuffer.remove(0);
		              AccUnit temp = new AccUnit();
		              temp.setX(accel_x);
		              temp.setY(accel_y);
		              temp.setZ(accel_z);
		              accBuffer.add(temp);
		            }
		            else{
		              AccUnit temp = new AccUnit();
		              temp.setX(accel_x);
		              temp.setY(accel_y);
		              temp.setZ(accel_z);
		              accBuffer.add(temp);
		            }
		            
		            if (!isFull && counter >= buff_len) {
		              isFull = true;
		            }
		            
		            // calculate the RMS
		            rms = 0;
		            
		            // tranpass the buffer and compute the RMS
		            for (int index = 0; index < accBuffer.size(); index++) {
		              int tempx = accBuffer.get(index).getX();
		              int tempy = accBuffer.get(index).getY();
		              int tempz = accBuffer.get(index).getZ();
		              
		              rms += tempx/ratio * tempx/ratio;
		              rms += tempy/ratio * tempy/ratio;
		              rms += tempz/ratio * tempz/ratio;
		            }

		            // update the RMS for each axis
		            rms = (float)Math.sqrt(rms/accBuffer.size());
		            
		            // print out the RMS
		            print("RMS: "+ rms);
		            
		            if(!motionBegin && rms > rms_thred){
		               // motion starts
		               motionBegin = true;
		               
		               // clear accBuffer_process
		               accBuffer_process.clear();
		               
		               // copy accBuffer to accBuffer_process
		               for(int i = 0; i < accBuffer.size(); i++){
		                  accBuffer_process.add(accBuffer.get(i)); 
		               }
		            }
		            else if(motionBegin && rms >= rms_thred){
		               // add the last (latest) one in accBuffer to accBuffer_process 
		               accBuffer_process.add(accBuffer.get(accBuffer.size()-1));
		            }
		            else if(motionBegin && rms < rms_thred){
		               // motion is over
		               motionBegin = false;
		              
		               // print out the FFT buffer size
		               println("FFT array size: "+ accBuffer_process.size());
		               int max = accBuffer_process.size() < FFTBufferSize? accBuffer_process.size(): FFTBufferSize;
		               for(int i = 0; i<max; i++){
		  				 rollingData_x[i] = accBuffer_process.get(i).getX();
		  				 rollingData_y[i] = accBuffer_process.get(i).getY();
		  				 rollingData_z[i] = accBuffer_process.get(i).getZ();
		  			   }
		  			   for(int t = max; t<  FFTBufferSize; t++){
		  				 rollingData_x[t] = 0;
		  				 rollingData_y[t] = 0;
		  				 rollingData_z[t] = 0;
		  			   }
		  			  
		  			   // Do the FFT
		  			   fft_x.forward(rollingData_x);
		  			   fft_y.forward(rollingData_y);
		  			   fft_z.forward(rollingData_z);
		              
		               // compute features over the accBuffer_process
		               float meanX = 0f, meanY = 0f, meanZ = 0f;
		               float X_MIN = 256f, X_MAX = -256f, Y_MIN = 256f, Y_MAX = -256f, Z_MIN = 256f, Z_MAX = -256f;
		               float powerX = 0f, powerY = 0f, powerZ = 0f;					// energy over the fft bands
		               float cross_pro_XY = 0f, cross_pro_YZ = 0f, cross_pro_ZX = 0f;
		               float sdX = 0f, sdY = 0f, sdZ = 0f;
		               int len = accBuffer_process.size();
		              
		               for(int j = 0; j < len; j++){
		                 int xx, yy, zz;
		                 AccUnit temp = accBuffer_process.get(j);
		                 xx = temp.getX();
		                 yy = temp.getY();
		                 zz = temp.getZ();
		              
		                 meanX += xx;
		                 meanY += yy;
		                 meanZ += zz;

		                 cross_pro_XY += xx * yy;
		                 cross_pro_YZ += yy * zz;
		                 cross_pro_ZX += zz * xx;

		                 if(xx <= X_MIN){
		                   X_MIN = xx;
		                 }
		                 if(xx >= X_MAX){
		                   X_MAX = xx;
		                 }
		                 if(yy <= Y_MIN){
		                   Y_MIN = yy;  
		                 }
		                 if(yy >= Y_MAX){
		                   Y_MAX = yy;  
		                 }
		                 if(zz <= Z_MIN){
		                   Z_MIN = zz;
		                 }
		                 if(zz >= Z_MAX){
		                   Z_MAX = zz;
		                 }
		               }
		              
		               meanX = meanX / len;
		               meanY = meanY / len;
		               meanZ = meanZ / len;

		               cross_pro_XY = cross_pro_XY / len;
		               cross_pro_YZ = cross_pro_YZ / len;
		               cross_pro_ZX = cross_pro_ZX / len;
		              
		               for (int j = 0; j < len; j++) {
		                 int xxx, yyy, zzz;
		                 AccUnit temp = accBuffer_process.get(j);
		                 xxx = temp.getX();
		                 yyy = temp.getY();
		                 zzz = temp.getZ();
		                 sdX += (xxx-meanX) * (xxx-meanX);
		                 sdY += (yyy-meanY) * (yyy-meanY);
		                 sdZ += (zzz-meanZ) * (zzz-meanZ);
		               }
		               sdX = sdX/len;
		               sdY = sdY/len;
		               sdZ = sdZ/len;
		               
		               // Compute the energy for each axis over the FFT bands
		               int specS_x = fft_x.specSize();
		               int specS_y = fft_y.specSize();
		               int specS_z = fft_z.specSize();
		               println("specS_x: "+ specS_x);
		               println("specS_y: "+ specS_y);
		               println("specS_z: "+ specS_z);
		               
		               for (int i = 0; i < specS_x; i++){
		            	   powerX += fft_x.getBand(i) * fft_x.getBand(i);
		               }
		               for (int i = 0; i < specS_y; i++){
		            	   powerY += fft_y.getBand(i) * fft_y.getBand(i);
			           }
		               for (int i = 0; i < specS_z; i++){
		            	   powerZ += fft_z.getBand(i) * fft_z.getBand(i);
			           }
		               
		               powerX = powerX / specS_x;
		               powerY = powerY / specS_y;
		               powerZ = powerZ / specS_z;
		               
		               // Collect data for training
		               if (isStartRec) {
		            	   String item = "";
		            	   float sumMean = meanX+meanY+meanZ;
		            	   float diff_xy = meanX-meanY, diff_yz = meanY-meanZ, diff_zx = meanZ-meanX;
		            	   float range_x = X_MAX-X_MIN, range_y = Y_MAX-Y_MIN, range_z = Z_MAX-Z_MIN;
		            	   
		            	   item += Float.toString(sumMean)+',';
		            	   item += Float.toString(diff_xy)+',';
		            	   item += Float.toString(diff_yz)+',';
		            	   item += Float.toString(diff_zx)+',';
		            	   item += Float.toString(powerX)+',';
		            	   item += Float.toString(powerY)+',';
		            	   item += Float.toString(powerZ)+',';
		            	   item += Float.toString(range_x)+',';
		            	   item += Float.toString(range_y)+',';
		            	   item += Float.toString(range_z)+',';
		            	   item += Float.toString(cross_pro_XY)+',';
		            	   item += Float.toString(cross_pro_YZ)+',';
		            	   item += Float.toString(cross_pro_ZX)+',';
		            	   item += Float.toString(sdX)+',';
		            	   item += Float.toString(sdY)+',';
		            	   item += Float.toString(sdZ)+',';
		            	   item += classNames[current_class]+'\n';
		            	   dataSet.add(item);
		            	   insNo++;
		            	   println("Class: "+classNames[current_class]+"# "+insNo);
		               }
		               else if(isLiveTesting){
		            	   // Live testing
		            	   float sumMean = meanX+meanY+meanZ;
		            	   float diff_xy = meanX-meanY, diff_yz = meanY-meanZ, diff_zx = meanZ-meanX;
		            	   float range_x = X_MAX-X_MIN, range_y = Y_MAX-Y_MIN, range_z = Z_MAX-Z_MIN;
		            	   
		            	   // Construct the feature
		            	   gestureTest_features[0] = sumMean;
		            	   gestureTest_features[1] = diff_xy;
		            	   gestureTest_features[2] = diff_yz;
		            	   gestureTest_features[3] = diff_zx;
		            	   gestureTest_features[4] = powerX;
		            	   gestureTest_features[5] = powerY;
		            	   gestureTest_features[6] = powerZ;
		            	   gestureTest_features[7] = range_x;
		            	   gestureTest_features[8] = range_y;
		            	   gestureTest_features[9] = range_z;
		            	   gestureTest_features[10] = cross_pro_XY;
		            	   gestureTest_features[11] = cross_pro_YZ;
		            	   gestureTest_features[12] = cross_pro_ZX;
		            	   gestureTest_features[13] = sdX;
		            	   gestureTest_features[14] = sdY;
		            	   gestureTest_features[15] = sdZ;
		            	   
		            	   int gesture_type = -1;
		            	   gesture_type = DTClassifier.classifyGesture(gestureTest_features);		// recognize the gesture
		            	   
		            	   switch(gesture_type){
		            	   		case 0: break;	// Idle
		            	   		case 1: break;	// Shake
		            	   		case 2: break; 	// Thrust
		            	   		case 3: break;	// Right Slap
		            	   		case 4: break;	// Left Slap
		            	   		case 5: break;	// Others
		            	   		default: break;
		            	   } 
		               }
		            }
		          }
		        }
		      }   
		}
			
		if (isTrainingData) {
			println("start training!");
			generateCsvFile("training_data_app1.csv"); 				// write in the csv file
			println("generate file is fine!");
			DTClassifier = new WekaJ48("training_data.csv");  // training!
				
			isTrainingData = false;
			insNo = 0;
			// After write into csv file, clear the dataset
			//dataSet.clear();
		}
		if (is_save_traing) {
			println("new training!");
			SecureRandom random = new SecureRandom();
			String code = new BigInteger(130, random).toString(32);
			generateCsvFile(code+"_training_data.csv"); 
				
			is_save_traing = false;
			insNo = 0;
	
			dataSet.clear();
			current_class = 0;
		}
	}
	
	public float[] arrayListToFloatArray(ArrayList<Float> floatArrayList)
	{
		float[] result = new float[floatArrayList.size()];
		int i = 0;
		for (Float f : floatArrayList) {
			result[i++] = (f != null ? f : Float.NaN);
		}
		return result;
	}
	
	/* Write features into a CSV file */
	public void generateCsvFile(String sFileName){
		try
		{
		    FileWriter writer = new FileWriter(sFileName);
		    String title = "";

		    // define other feature titles
		    title += "mean_sum,diff_XY,diff_YZ,diff_ZX,power_X,power_Y,power_Z,range_X,range_Y,range_Z,crosspro_XY,crosspro_YZ,crosspro_ZX,SD_X,SD_Y,SD_Z,Label\n";
		    writer.append(title);
		    
		    for(int i = 0; i<dataSet.size(); i++){
		    	writer.append(dataSet.get(i));
		    }
	 
		    writer.flush();
		    writer.close();
		}
		catch(IOException e)
		{
		     e.printStackTrace();
		} 
	}
	
	public void keyPressed(){
		if (key == CODED) {
			if (keyCode == RIGHT) {
				// next gesture
				current_class = (current_class+1) % (classNames.length);
				if(isStartRec)
					insNo = 0;
			}
			else if (keyCode == LEFT) {
				// previous gesture
				current_class -= 1;
				if (current_class<0) 
					current_class = classNames.length-1;
				if(isStartRec)
					insNo = 0;
			}
			println("Current class: " + classNames[current_class]);
		}
		else if(key == 'r'){
			// Start recording gesture data
			println("Start recording gesture!");
			isStartRec = true;
			isTrainingData = false;
			isLiveTesting = false;
			is_save_traing = false;
		}
		else if(key == 's'){
			println("Save this training set");
			isStartRec = false;
			isTrainingData = false;
			isLiveTesting = false;
			is_save_traing = true;
		}
		else if(key == 'c'){
			// Show current class name
			println("Current class: "+ classNames[current_class]);
		}
		else if(key =='t'){
			// Start data training
			println("Start data training!");
			isTrainingData = true;
			isStartRec = false;
			isLiveTesting = false;
			is_save_traing = false;
		}
		else if(key =='y'){
			println("Start live testing!");
			isLiveTesting = true;
			isStartRec = false;
			isTrainingData = false;
			is_save_traing = false;
		}
		else if(key == 'd'){
			// delete incorrect training instance
			if(isStartRec && dataSet.size() > 0){
				println("Delete last gesture instance!");
				dataSet.remove(dataSet.size()-1);
				println("dataSet's size: "+ dataSet.size());
			}
		}
	}
	
	// Data structure for storing all accelerometer data
	public class AccUnit{
		   private int _acc_x;
		   private int _acc_y;
		   private int _acc_z;

		   public void setX(int x){
		     _acc_x = x;
		   }
		   public void setY(int y){
		     _acc_y = y;
		   }
		   public void setZ(int z){
		     _acc_z = z;
		   }

		   public int getX(){
		     return _acc_x;
		   }
		   public int getY(){
		     return _acc_y;
		   }
		   public int getZ(){
		     return _acc_z;
		   }
		};
}

