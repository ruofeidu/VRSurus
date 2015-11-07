import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
import java.util.Timer;

import processing.core.PApplet;
import processing.core.PFont;
import ddf.minim.spi.*;
import ddf.minim.signals.*;
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.effects.*;

public class PrimitiveMLTrainer_simpleview extends PApplet implements AudioListener {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	String user = "user4";
	Minim minim;
	AudioInput in;
	
	Minim minim_player;
	AudioPlayer player;
	

	int bufSize = 1024;				// the size of audio buffer
	int numBuffers =5;				// the size of buffer for RMS testing
	int FFTBufferSize = 16*1024;	// the size of buffer for FFT 

	SoundData[] ss_array = new SoundData[numBuffers];				// RMS array
	ArrayList<SoundData> FFT_array = new ArrayList<SoundData>();	// FFT ArrayList 

	boolean isGes = false;			// test if the gesture is on
	boolean isGestureDone = false;  // test if the gesture is done
	boolean is_has_quit = false;	// test if the user has quit gesture collection once
	
	float RMS = 0;					
	int count = 0;
	float sum = 0;
	
	float threshold = 0.01f;		// threshold

	FFT fft;
	float[] rollingData = new float[FFTBufferSize];				// the buffer for FFT
	
	// Machine Learning 
	WekaClassifier SVMClassifier;
	int numClass = 10;
	String[] classNames = {"top_down","top_up","right_down","right_up","bottom_down","bottom_up","left_down","left_up","center","other"};
	int[] classCounts = new int[numClass];
	int current_class = 0;										// index of current training class
	ArrayList<String> dataSet = new ArrayList<String>(); 		// store all instances
	// Flags for machine learning
	boolean isStartRec = false;
	boolean isTrainingData = false;
	boolean isLiveTesting = false;
	boolean is_save_traing = false;
	
	int insNo = 0;											// count the number of trained instances
	
	float[] fft_bands = new float[FFTBufferSize/2+1];		// store all frequency band after FFT
	
	// buffer for downsample signals
	int downsample_size = 256; 								// alternative: 100, 16, 128
	int downsample_size_bandratio = 32;						// downsample size for bandratio
	ArrayList<Float> bandratios = new ArrayList<Float>(); 
	
	float[] fft_downsample = new float[downsample_size];
	float[] fft_downsample_bandratio = new float[downsample_size_bandratio];
	
	float RMS_feature, mean_feature, stdDev_feature, center_Mass_feature, Kurtosis_feature;
	int min_Index_feature, max_Index_feature;
	float[] gestureTest_features = new float[downsample_size+7+(downsample_size_bandratio-1)*downsample_size_bandratio/2];
	
	// set time gap for different gesture detection
	int savedTime = millis();
	int totalTime = 400;
	PFont font;
	
	public void setup(){
		background(0);
		size(896, 600);
		minim = new Minim(this);
		in = minim.getLineIn(Minim.MONO);     // sample buffer: 1024; sample rate: 44100; bit depth: 16
		in.addListener(this);
		
		minim_player = new Minim(this);

		frameRate(60);

		/* Initial all buffers */
		for(int j = 0; j<numBuffers; j++){
			ss_array[j] = new SoundData(); 
		}
		for(int j=0; j<downsample_size; j++){
			fft_downsample[j] = 0;
		}
		for(int j=0; j<downsample_size_bandratio; j++){
			fft_downsample_bandratio[j] = 0;
		}
		for(int j=0; j<numClass; j++){
			classCounts[j] = 0;
		}
		
		/* Initial fft object */
		fft = new FFT(FFTBufferSize,in.sampleRate());
	  
		/* Initial font */
		font = createFont("FrutigerLT-Cn",20);
		textFont(font);

	}

	public void draw(){
		if(isGestureDone) {
			
			/*for(int i = 0; i<rollingData.length; i++){
				float x1 = i*width/(rollingData.length);
				point(x1, height/2 - rollingData[i]*50000);
			}*/
			/*for(int i =0; i < FFT_array.size(); i++){
			  for(int j = 0; j<1023; j++){
				 float x1 = (i*1024+j)*width/(FFT_array.size()*1024);
				 float x2 = (i*1024+j+1)*width/(FFT_array.size()*1024);
				 // draw the raw audio data
				 line( x1, height/2 - FFT_array.get(i).get_data(j)*50000, x2, height/2 - FFT_array.get(i).get_data(j+1)*50000);
				 //point(x1,height/2 - FFT_array.get(i).get_data(j)*50000);
			  }
			}*/
			
			int specS = fft.specSize();
			println("specS: "+specS);
			for(int i = 0; i < specS; i++){
			  float x1 = width*i/specS;
			  //float x2 = width*(i+1)/specS;
			  //line( x1, height -fft.getBand(i)*800, x2, height-fft.getBand(i+1)*800 );
			  //point(x1, height -fft.getBand(i)*800);
			  fft_bands[i] = fft.getBand(i);
			}
			if(isLiveTesting){
				background(0);
				/* Live training and testing */
				fft_downsample = downSample(fft_bands, downsample_size); 		// downsample FFT data
				fft_downsample_bandratio = downSample(fft_bands, downsample_size_bandratio); 		// downsample FFT data
				bandratios = spectralBandRatio(fft_downsample_bandratio);		// calculate band ratio as features
				for(int i = 0; i<bandratios.size(); i++){
					gestureTest_features[i] = bandratios.get(i);
				}
				
				float rms_fft = 0;
				float sum_fft = 0;
				float dev_sum_fft = 0;
				float totalSum = 0;
				float u4 = 0;
				
				float mx = Float.MIN_VALUE;
				int mx_indx = 0;
				
				float mn = Float.MAX_VALUE;
				int mn_indx = 0;
				
				for(int i = 0; i<fft_downsample.length; i++){
					// add downsampled data into the feature
					gestureTest_features[bandratios.size()+i] = fft_downsample[i];
					rms_fft += pow(fft_downsample[i],2);
					sum_fft += fft_downsample[i];
					if (fft_downsample[i]>mx) {
						mx = fft_downsample[i];
						mx_indx = i;
					}
					if (fft_downsample[i]<mn) {
						mn = fft_downsample[i];
						mn_indx = i;
					}
					totalSum += i*fft_downsample[i];
				}
				// add more features
				// calculate RMS and store it as a feature
				gestureTest_features[bandratios.size()+fft_downsample.length] = sqrt(rms_fft/fft_downsample.length);
				
				// calculate mean and store it as a feature
				gestureTest_features[bandratios.size()+fft_downsample.length+1] = sum_fft/fft_downsample.length;
				
				// calculate standard deviation and store it as a feature
				for(int i = 0; i<fft_downsample.length; i++){
					dev_sum_fft += pow(fft_downsample[i]-gestureTest_features[bandratios.size()+fft_downsample.length+1], 2);
					u4 += pow(fft_downsample[i]-gestureTest_features[bandratios.size()+fft_downsample.length+1], 4);
				}
				gestureTest_features[bandratios.size()+fft_downsample.length+2] = sqrt(dev_sum_fft/fft_downsample.length);
				
				// find the minimum index and store it as a feature
				gestureTest_features[bandratios.size()+fft_downsample.length+3] = mn_indx;
				
				// find the maximum index and store it as a feature
				gestureTest_features[bandratios.size()+fft_downsample.length+4] = mx_indx;
				
				// calculate the center of mass and store it as a feature
				gestureTest_features[bandratios.size()+fft_downsample.length+5] = totalSum/sum_fft;
				
				// calculate Kurtosis and store it as a feature
				gestureTest_features[bandratios.size()+fft_downsample.length+6] = (u4/fft_downsample.length)/pow(gestureTest_features[bandratios.size()+fft_downsample.length+2],4);
				
				int gesture_type = -1;
				gesture_type = SVMClassifier.classifyGesture(gestureTest_features);		// recognize the gesture
				
				/* print the detected gesture */
				textFont(font);
			  	textAlign(LEFT, LEFT);
			  	fill(255,255,255);
			  	text("Gesture:", 1010,25);
			  	text(classNames[gesture_type], 1010, 50);
				println("Recognized gesture: "+classNames[gesture_type]);
				
				/* Visualize all data */
				for(int jj=0; jj< bandratios.size(); jj++){
					stroke(61,185,243);
					strokeWeight(1);
					line(2*jj, height/3, 2*jj, height/3-((bandratios.get(jj)*50>=190)?190:bandratios.get(jj)*50));
				}
				fill(61,185,243);
			  	text("Band ratios", 905, 25);
			  	
			  	for(int jj=0; jj< downsample_size; jj++){
			  		stroke(191,237,31);
					strokeWeight(3);
					line(6*jj, height*2/3, 6*jj, height*2/3-((fft_downsample[jj]*500>=190)? 190:fft_downsample[jj]*500));
			  	}
			  	fill(191,237,31);
			  	text("FFT", 960, 25+200);
				/* Visualize all data */
			  	// RMS
			  	noStroke();
				fill(248,118,237);
			  	rect(0, height-27*7, (gestureTest_features[downsample_size+bandratios.size()]*1000>=992)?992:gestureTest_features[downsample_size+bandratios.size()]*1000, 25);
			  	text("RMS", (gestureTest_features[downsample_size+bandratios.size()]*1000>=992)?1002:(gestureTest_features[downsample_size+bandratios.size()]*1000+10),height-27*6-7);
			  	
			  	// Mean
			  	noStroke();
			  	fill(252,218,81);
			  	rect(0, height-27*6,(gestureTest_features[downsample_size+bandratios.size()+1]*1000>=992)?992:gestureTest_features[downsample_size+bandratios.size()+1]*1000, 25);
			  	text("Mean", (gestureTest_features[downsample_size+bandratios.size()+1]*1000>=992)?1002:(gestureTest_features[downsample_size+bandratios.size()+1]*1000+10),height-27*5-7);
			  	
			  	// SD
			  	noStroke();
			  	fill(252,145,81);
			  	rect(0, height-27*5, (gestureTest_features[downsample_size+bandratios.size()+2]*1000>=992)?992:gestureTest_features[downsample_size+bandratios.size()+2]*1000, 25);
			  	text("SD", (gestureTest_features[downsample_size+bandratios.size()+2]*1000>=992)?1002:(gestureTest_features[downsample_size+bandratios.size()+2]*1000+10),height-27*4-7);
			  	
			  	// Min_index
			  	noStroke();
			  	fill(246,252,81);
			  	rect(0, height-27*4, (gestureTest_features[downsample_size+bandratios.size()+3]*2>=992)?992:gestureTest_features[downsample_size+bandratios.size()+3]*2, 25);
			  	text("Min Idx", (gestureTest_features[downsample_size+bandratios.size()+3]*2>=992)?1002:(gestureTest_features[downsample_size+bandratios.size()+3]*2+10),height-27*3-7);
			  	
			  	// Max_index
			  	noStroke();
			  	fill(209,138,236);
			  	rect(0, height-27*3, (gestureTest_features[downsample_size+bandratios.size()+4]*2>=992)?992:gestureTest_features[downsample_size+bandratios.size()+4]*2, 25);
			  	text("Max Idx", (gestureTest_features[downsample_size+bandratios.size()+4]*2>=992)?1002:(gestureTest_features[downsample_size+bandratios.size()+4]*2+10),height-27*2-7);
			  	
			  	// Center of Mass
			  	noStroke();
			  	fill(241,88,95);
			  	rect(0, height-27*2, (gestureTest_features[downsample_size+bandratios.size()+5]*10>=992)?992:gestureTest_features[downsample_size+bandratios.size()+5]*10, 25);
			  	text("Center of Mass", (gestureTest_features[downsample_size+bandratios.size()+5]*10>=992)?1002:(gestureTest_features[downsample_size+bandratios.size()+5]*10+10),height-27-7);
			  	
			  	// Kurtosis
			  	noStroke();
			  	fill(127,238,218);
			  	rect(0, height-27, (gestureTest_features[downsample_size+bandratios.size()+6]*5>=992)?992:gestureTest_features[downsample_size+bandratios.size()+6]*5, 25);
			  	text("Kurtosis", (gestureTest_features[downsample_size+bandratios.size()+6]*5>=992)?1002:(gestureTest_features[downsample_size+bandratios.size()+6]*5+10),height-7);
			}
			else if(isStartRec){
				if(player != null){
					player.close();
				}
				background(0);
				bandratios.clear();
				/* downsample raw FFT data */
				fft_downsample = downSample(fft_bands, downsample_size);
				fft_downsample_bandratio = downSample(fft_bands, downsample_size_bandratio); 		// downsample FFT data
				//bandratios = spectralBandRatio(fft_downsample_bandratio);		// calculate band ratio as features
				
				
			  	
			  	for(int jj=1; jj< downsample_size; jj++){
			  		stroke(240,237,41);
					strokeWeight(2);
					line(3*(jj-1)+100, height*9/10-(fft_downsample[jj-1]*150), 3*jj+100, height*9/10-(fft_downsample[jj]*150));
					//stroke(110,117,86);
					//line(jj, height*9/10, jj, height*9/10-(fft_downsample[jj]*10)+2);
			  	}
			  	
			  	/*for(int jj=0; jj< rollingData.length; jj++){
			  		stroke(191,237,31);
					strokeWeight(3);
					line(jj/16, height*4/5, jj/16, height*4/5-rollingData[jj]*100000);
			  	}*/
			  	
			}
			isGestureDone = false;
		}
		
		if(isTrainingData){
			background(0);
			println("start training!");
			generateCsvFile("training_data_app1.csv"); 				// write in the csv file
			println("generate file is fine!");
			SVMClassifier = new WekaClassifier("training_data_app1.csv");  // training!
			
			isTrainingData = false;
			insNo = 0;
			
			background(0);
			textFont(font);
		  	textAlign(LEFT, LEFT);
		  	fill(255,255,255);
		  	text("Training completed!", 1010,25);
			// After write into csv file, clear the dataset
			//dataSet.clear();
		}
		if(is_save_traing){
			println("new training!");
			SecureRandom random = new SecureRandom();
			String code = new BigInteger(130, random).toString(32);
			generateCsvFile(user+"_"+code+"_training_data_app1.csv"); 
			
			is_save_traing = false;
			insNo = 0;
			
			background(0);
			textFont(font);
		  	textAlign(LEFT, LEFT);
		  	fill(255,255,255);
		  	text("Training completed!", 1010,25);
		  	dataSet.clear();
		  	for(int j=0; j<numClass; j++){
				classCounts[j] = 0;
			}
		  	current_class = 0;
		}
	}
	
	public ArrayList<Float> spectralBandRatio(float[] signal) {
		// Add ratio as features
		ArrayList<Float> ratios = new ArrayList<Float>();
		for (int i=0; i<signal.length; i++)
		{
		  for (int j=i+1; j<signal.length; j++)
		  {
			  ratios.add((1+signal[i])/(1+signal[j]));
		  }
		}
		return ratios;
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
		    for(int i = 1; i<bandratios.size()+1; i++){
		    	title += "bandratio"+i+",";
		    }
		    // need to change the max limit of the bin
		    for(int i = 1; i<downsample_size+1; i++){
		    	title += "bin"+i+",";
		    }
		    // define other feature titles
		    title += "RMS,mean,SD,min_index,max_index,center of mass,Kurtosis,label\n";
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
	
	/* Downsampling FFT data */
	public float[] downSample(float[] samples, int downSampleSize)
	{
		// Divide Spectral Band into DOWNSAMPLE_SIZE
		int residue = samples.length%(int)downSampleSize;
		int binSize = 0;
		
		// Figure out the width of the each downsampled band
		if (residue<(downSampleSize*0.5f)) {
			binSize = (int)Math.floor((float)samples.length/downSampleSize);
		} else {
			binSize = (int)Math.ceil((float)samples.length/downSampleSize);
		}
		
		float[] result = new float[downSampleSize];
		int subSampleCount = 0;
		int current_index = 0;
		for (int i=0; i<samples.length; i++)
		{
			int index = (int) Math.floor(i/binSize);
			index = (int)Math.min(downSampleSize-1, index);
			if (index==current_index) {
				subSampleCount += 1;
				result[index] += samples[i];
			} else {
				// Calculate the average value of the bin
				result[current_index] = result[current_index]/subSampleCount;
				current_index = index;
				subSampleCount = 1;
			}
		}
		
		// Perform this for the very last downsample band
		result[current_index] = result[current_index]/subSampleCount;
		return result;
	}
	
	public void keyPressed(){
		if(key == CODED){
			if(keyCode == RIGHT){
				// next gesture
				current_class = (current_class+1) % (classNames.length);
				if(isStartRec)
					insNo = 0;
			}
			else if(keyCode == LEFT){
				// previous gesture
				current_class -= 1;
				if (current_class<0) 
					current_class = classNames.length-1;
				if(isStartRec)
					insNo = 0;
			}
			background(0);
			textFont(font);
		  	textAlign(LEFT, LEFT);
		  	fill(255,255,255);
		  	text("Training:", 1010,25);
		  	text(classNames[current_class], 1100, 25);
		  	text("Number:", 1010,75);
		  	text(dataSet.size(), 1160, 75);
		  	for(int i=0; i<classNames.length; i++){
		  		text(classNames[i]+": ", 1010,75+25*(i+1));
			  	text(classCounts[i], 1160, 75+25*(i+1));
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
			
			if(!is_has_quit){
				background(0);
				textFont(font);
				textAlign(LEFT, LEFT);
				fill(255,255,255);
				text("Start training!", 1010,25);
			}
		}
		else if(key == 's'){
			println("Save this training set");
			isStartRec = false;
			isTrainingData = false;
			isLiveTesting = false;
			is_save_traing = true;
		}
		else if(key == 'q'){
			// Quit recording gesture data
			println("Quit recording gesture!");
			isStartRec = false;
			isTrainingData = false;
			isLiveTesting = false;
			is_save_traing = false;
			is_has_quit = true;
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
			
			background(0);
			textFont(font);
		  	textAlign(LEFT, LEFT);
		  	fill(255,255,255);
		  	text("Loading model...", 1010,25);
		}
		else if(key =='y'){
			println("Start live testing!");
			isLiveTesting = true;
			isStartRec = false;
			isTrainingData = false;
			is_save_traing = false;
			
			background(0);
			textFont(font);
		  	textAlign(LEFT, LEFT);
		  	fill(255,255,255);
		  	text("Start testing", 1010,25);
		}
		else if(key == 'd'){
			// delete incorrect training instance
			if(isStartRec && dataSet.size() > 0){
				println("Delete last gesture instance!");
				dataSet.remove(dataSet.size()-1);
				classCounts[current_class]--;
				
				background(0);
				textFont(font);
			  	textAlign(LEFT, LEFT);
			  	fill(255,255,255);
			  	text("Training:", 1010,25);
			  	text(classNames[current_class], 1100, 25);
			  	text("Number:", 1010,75);
			  	text(dataSet.size(), 1160, 75);
			  	for(int i=0; i<classNames.length; i++){
			  		text(classNames[i]+": ", 1010,75+25*(i+1));
				  	text(classCounts[i], 1160, 75+25*(i+1));
			  	}
				println("dataSet's size: "+ dataSet.size());
			}
		}
	}
	
	/* basic data structure of audio signal */
	public class SoundData{
	  public float[] data;
	  SoundData() {
	    data = new float[1024];
	  }
	  void set_data(float[] in) {
		  for(int i=0; i<1024; i++){
			  data[i] = in[i];
		  }
	  }
	  float get_data(int index){
	    return data[index];  
	  }
	}
	
	@Override
	public void samples(float[] audio, float[] arg1) {
		
	}

	@Override
	public void samples(float[] audio) {
		/* shift the RMS buffer as a circular list */
		for(int index = numBuffers-1; index>=1; index--){
			for(int j = 0; j<1024; j++){
				ss_array[index].set_data(ss_array[index-1].data);	// pointer problem resolved!
			}
		}
		ss_array[0].set_data(audio);	// set the first one in the RMS buffer as the new coming audio signal
	
		/* calculate RMS */
		for(count = 0; count<numBuffers-1; count++){
			for(int ii =0; ii< audio.length; ii++){
				sum += ss_array[count].get_data(ii)*ss_array[count].get_data(ii);
			}
		}
		RMS = sqrt(sum/(audio.length*numBuffers));
				
		if(RMS >= threshold && !isGes){
			int currTime = millis();
			if(currTime - savedTime >totalTime) {
				// current gesture should have totalTime interval after the previous gesture
				// gesture begins
				FFT_array.clear();
				isGes = true;  
				println("******************* Ges Begins **********************"); 
				
				// for the first time store all data in the ss_array (numBuffers)
				for(int i = numBuffers-1; i>=0; i--) {
					SoundData data = new SoundData();
					data.set_data(ss_array[i].data);
					FFT_array.add(data);
				}
			}
		}
		else if(RMS >= threshold && isGes){
			// Store gesture data
			SoundData data = new SoundData();
			data.set_data(ss_array[0].data);
			FFT_array.add(data);
		}
		else if(RMS < threshold && isGes){
			isGes = false; 
			// Stop gesture
			// Stop storing new data for FFT
			println("FFT array size: "+ FFT_array.size());

			// convert FFT_array to array that stores original data with the length of FFTBufferSize
			int max = FFT_array.size() < FFTBufferSize/1024? FFT_array.size(): FFTBufferSize/1024;
			for(int i = 0; i<max; i++){
				for(int j = 0; j<1024; j++){
					rollingData[i*1024+j] = FFT_array.get(i).get_data(j);
				}
			}
			for(int t = 1024*max; t<  FFTBufferSize; t++){
				rollingData[t] = 0;
			}
				
			// Do the FFT
			fft.forward(rollingData);
			println("******************* Out of Ges **********************");
			savedTime = millis();
			isGestureDone = true;
		} 
		// println("RMS: "+RMS);
		// reset the total number for RMS calculation
		sum = 0;
	}
}

