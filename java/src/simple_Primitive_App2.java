import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.Timer;

import javax.print.attribute.standard.Media;

import org.gstreamer.media.MediaPlayer;

import processing.core.PApplet;
import processing.core.PFont;
import ddf.minim.spi.*;
import ddf.minim.signals.*;
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.effects.*;


public class simple_Primitive_App2 extends PApplet implements AudioListener {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Minim minim;
	AudioInput in;

	Minim minim_player;
	AudioPlayer player;

	int bufSize = 1024;				// the size of audio buffer
	int numBuffers =5;				// the size of buffer for RMS testing
	int FFTBufferSize = 16*1024;	// the size of buffer for FFT 

	SoundData[] ss_array = new SoundData[numBuffers];				// RMS array
	ArrayList<SoundData> FFT_array = new ArrayList<SoundData>();	// FFT ArrayList 

	boolean isGes = false;			//e test if the gesture is on
	boolean isGestureDone = false;  // test if the gesture is done
	
	float RMS = 0;					
	int count = 0;
	float sum = 0;
	
	float threshold = 0.0005f;		// threshold

	FFT fft;
	float[] rollingData = new float[FFTBufferSize];				// the buffer for FFT
	
	// Machine Learning 
	WekaClassifier SVMClassifier;
	int numClass = 9;
	String[] classNames = {"left_ear", "right_ear", "two ears","right_hand","left_hand","two hands","poke","press", "other"};
	int[] classCounts = new int[numClass];
	int current_class = 0;										// index of current training class
	ArrayList<String> dataSet = new ArrayList<String>(); 		// store all instances
	// Flags for machine learning
	boolean isStartRec = false;
	boolean isTrainingData = false;
	boolean isLiveTesting = false;
	int insNo = 0;											// count the number of trained instances
	
	float[] fft_bands = new float[FFTBufferSize/2+1];		// store all frequency band after FFT
	
	// buffer for downsample signals
	int downsample_size = 128; 								// alternative: 100, 16, 128
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
		background(255,255,255);
		size(600, 400);
		smooth();
		
		// Initial others
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
		for(int j=0; j<numClass; j++){
			classCounts[j] = 0;
		}
	  
		/* Initial fft object */
		fft = new FFT(FFTBufferSize,in.sampleRate());
		
		SVMClassifier = new WekaClassifier("training_data_app2.csv");  // training!
	}

	public void draw(){
		
		if(isGestureDone) {
			
			int specS = fft.specSize();
			for(int i = 0; i < specS; i++){
			  fft_bands[i] = fft.getBand(i);
			}
		
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
			
			println("gesture: "+gesture_type);
			if(gesture_type == 0){
				// left ear
				background(255, 255, 255);
				noStroke();
				font = createFont("FrutigerLT-Cn",60);
				textFont(font);
				fill(61,190,255);
				rect(200,130,200,100,10);
				fill(255,255,255);
			  	text("Left Ear", 215,200);
			  	println("Gesture: "+classNames[gesture_type]);
			}
			else if(gesture_type == 1){
				// right ear
				background(255, 255, 255);
				noStroke();
				font = createFont("FrutigerLT-Cn",60);
				textFont(font);
				fill(247,84,51);
				rect(185,130,230,100,10);
				fill(255,255,255);
			  	text("Right Ear", 200,200);
			  	println("Gesture: "+classNames[gesture_type]);
			}
			else if(gesture_type == 2){
				// two ears
				background(255, 255, 255);
				noStroke();
				font = createFont("FrutigerLT-Cn",60);
				textFont(font);
				fill(151,206,74);
				rect(180,130,240,100,10);
				fill(255,255,255);
			  	text("Two Ears", 200,200);
			  	println("Gesture: "+classNames[gesture_type]);
			}
			else if(gesture_type == 3){
				// right hand
				background(255,255,255);
				noStroke();
				font = createFont("FrutigerLT-Cn",60);
				textFont(font);
				fill(134,75,229);
				rect(160,130,270,100,10);
				fill(255,255,255);
			  	text("Right Hand", 170,200);
			  	println("Gesture: "+classNames[gesture_type]);
			}
			else if(gesture_type == 4){
				// left hand
				background(255, 255, 255);
				noStroke();
				font = createFont("FrutigerLT-Cn",60);
				textFont(font);
				fill(222,112,234);
				rect(160,130,260,100,10);
				fill(255,255,255);
			  	text("Left Hand", 185,200);
			  	println("Gesture: "+classNames[gesture_type]);
			}
			else if(gesture_type == 5){
				// two hands
				background(255, 255, 255);
				noStroke();
				font = createFont("FrutigerLT-Cn",60);
				textFont(font);
				fill(242,70,133);
				rect(170,130,270,100,10);
				fill(255,255,255);
			  	text("Two Hands", 180,200);
			  	println("Gesture: "+classNames[gesture_type]);
			}
			else if(gesture_type == 6){
				// poke
				background(255, 255, 255);
				noStroke();
				font = createFont("FrutigerLT-Cn",60);
				textFont(font);
				fill(100,123,234);
				rect(200,130,200,100,10);
				fill(255,255,255);
			  	text("Poke", 237,200);
			  	println("Gesture: "+classNames[gesture_type]);
			}
			else if(gesture_type == 7){
				// press
				background(255, 255, 255);
				noStroke();
				font = createFont("FrutigerLT-Cn",60);
				textFont(font);
				fill(239,95,79);
				rect(200,130,200,100,10);
				fill(255,255,255);
			  	text("Press", 235,200);
			  	println("Gesture: "+classNames[gesture_type]);
			}
			else if(gesture_type == 8){
				// Other
			}
			gesture_type = -1;
			isGestureDone = false;
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
			savedTime = millis();
			isGestureDone = true;
		} 
		// println("RMS: "+RMS);
		// reset the total number for RMS calculation
		sum = 0;
	}
}

