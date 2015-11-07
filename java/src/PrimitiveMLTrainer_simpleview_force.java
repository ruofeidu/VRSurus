import java.util.ArrayList;
import processing.core.PApplet;
import processing.core.PFont;
import ddf.minim.*;
import ddf.minim.analysis.*;


public class PrimitiveMLTrainer_simpleview_force extends PApplet implements AudioListener {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	Minim minim;
	AudioInput in;
	
	Minim minim_player;
	AudioPlayer player;
	

	int bufSize = 1024;				// the size of audio buffer
	int numBuffers =10;				// the size of buffer for RMS testing
	int FFTBufferSize = 16*1024;	// the size of buffer for FFT 

	SoundData[] ss_array = new SoundData[numBuffers];				// RMS array
	ArrayList<SoundData> FFT_array = new ArrayList<SoundData>();	// FFT ArrayList 
	
	float RMS = 0;					
	int count = 0;
	float sum = 0;
	
	float threshold = 0.01f;		// threshold

	FFT fft;
	float[] rollingData = new float[FFTBufferSize];				// the buffer for FFT
	
	float[] fft_bands = new float[FFTBufferSize/2+1];		// store all frequency band after FFT
	
	// buffer for downsample signals
	int downsample_size = 256; 								// alternative: 100, 16, 128
	
	float[] fft_downsample = new float[downsample_size];
	//float[] fft_downsample_bandratio = new float[downsample_size_bandratio];
	
	float RMS_feature, mean_feature;

	// set time gap for different gesture detection
	int savedTime = millis();
	int totalTime = 400;
	PFont font;

	float diameter = 200f;
	
	// dot declaration
	float dot_x = 300.0f;
	float dot_y = 300.0f;
	float dot_w = 100.0f;
	float dot_h = 100.0f;
	float scale_rate = 1.0f;
	
	dotData dot = new dotData(dot_x,dot_y,dot_w,dot_h, 231, 82, 82); 
	
	/* basic dot data structure */
	public class dotData{
		float x;
		float y;
		float w;
		float h;
		float r;
		float g;
		float b;
		  
		dotData(float c_x, float c_y, float c_w, float c_h, float c_r, float c_g, float c_b){
		    x = c_x;
		    y = c_y;
		    w = c_w;
		    h = c_h;
		    r = c_r;
		    g = c_g;
		    b = c_b;
		}
		  
		void setLocation(float loc_x, float loc_y){
		    x = loc_x;
		    y = loc_y; 
		}
		  
		void setSize(float cus_w, float cus_h){
		    w = cus_w;
		    h = cus_h; 
		}
		  
		void setColor(float cus_r, float cus_g, float cus_b){
		    r = cus_r;
		    g = cus_g;
		    b = cus_b; 
		}
		  
		void redraw(){
			fill(255,90);
			rect(0,0,width,height);
			
		    noStroke();
		    fill(r,g,b);
		    ellipse(x, y, w, h);
		}
	}
	public void setup(){
		background(255,255,255);
		size(600,600);
		smooth();
		
		
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
		
		
		/* Initial fft object */
		fft = new FFT(FFTBufferSize,in.sampleRate());
	  
		/* Initial font */
		font = createFont("FrutigerLT-Cn",20);
		textFont(font);

	}
	

	public void draw(){

		int specS = fft.specSize();
		for(int i = 0; i < specS; i++){
		  float x1 = width*i/specS;
		  fft_bands[i] = fft.getBand(i);
		}

		/* downsample raw FFT data */
		fft_downsample = downSample(fft_bands, downsample_size);
				
		/* Append feature data into CSV file */
		float rms_fft = 0;
		float sum_fft = 0;
		float totalSum = 0;
				
		for(int i = 0; i<fft_downsample.length; i++){
			// add downsampled data into the feature
			rms_fft += pow(fft_downsample[i],2);
			sum_fft += fft_downsample[i];
			totalSum += i*fft_downsample[i];
		}
		
		// add more features
		// calculate RMS and store it as a feature
		RMS_feature = sqrt(rms_fft/fft_downsample.length);
				
		// calculate mean and store it as a feature
		mean_feature = sum_fft/fft_downsample.length;		
		
		// redraw circle
		dot.setSize(dot_w*(1+scale_rate), dot_h*(scale_rate+1));
		dot.setLocation(dot_x-dot_w*RMS/2.0f, dot_y-dot_h*RMS/2.0f);
		dot.redraw();
		scale_rate = RMS*100;
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
		println("initial RMS:"+RMS);	
		sum = 0;
		if(RMS <= threshold) RMS = 0;
	}
}

