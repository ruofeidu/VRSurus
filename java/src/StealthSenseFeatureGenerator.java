import java.util.ArrayList;

import ddf.minim.analysis.FFT;


class FrequencySweepRange
{
	float start = 0;
	float end = 0;
	
	public FrequencySweepRange(float s, float e) {
		start = s;
		end = e;
	}
}

public class StealthSenseFeatureGenerator {
	
	public static FrequencySweepRange InfraSound = new FrequencySweepRange(2, 12);
	public static FrequencySweepRange UltraSound = new FrequencySweepRange(19000, 40000);
	boolean generateFeatureLabels = false;
	ArrayList<String> featureLabels = new ArrayList<String>();
	
	public ArrayList<Float> featuresFromFFT(FFT fft) {
		ArrayList<Float> features = new ArrayList<Float>();
		featureLabels.clear();
		
		// Extract Raw FFT
		float[] infraSoundSignal = extractInfraSound(fft);
		float[] ultraSoundSignal = downSample(extractUltraSound(fft), 448);
		for (int i=0; i<infraSoundSignal.length; i++) { features.add(infraSoundSignal[i]); featureLabels.add("rawfftInfra"+i); }
		for (int i=0; i<ultraSoundSignal.length; i++) { features.add(ultraSoundSignal[i]); featureLabels.add("rawfftUltra"+i); }
		
		// RMS
		features.add(RMS(infraSoundSignal)); featureLabels.add("infraRMS");
		features.add(RMS(ultraSoundSignal)); featureLabels.add("ultraRMS");
		
		// Center of Mass
		features.add(centerOfMass(infraSoundSignal)); featureLabels.add("infraCenterOfMass");
		features.add(centerOfMass(ultraSoundSignal)); featureLabels.add("ultraCenterOfMass");
		
		// Max and Min
		int infraSoundMaxIndex = maxIndex(infraSoundSignal); 
		int ultraSoundMaxIndex = maxIndex(ultraSoundSignal); 
		features.add(fft.indexToFreq(fft.freqToIndex(InfraSound.start)+infraSoundMaxIndex)); featureLabels.add("infraMaxFreq");
		features.add(fft.indexToFreq(fft.freqToIndex(UltraSound.start)+ultraSoundMaxIndex)); featureLabels.add("ultraMaxFreq");
		features.add(infraSoundSignal[infraSoundMaxIndex]); featureLabels.add("infraMaxValue");
		features.add(ultraSoundSignal[ultraSoundMaxIndex]); featureLabels.add("ultraMaxValue");
		
		// Average
		features.add(average(infraSoundSignal)); featureLabels.add("infraAverage");
		features.add(average(ultraSoundSignal)); featureLabels.add("ultraAverage");
		
		// Standard Deviation
		features.add(standardDeviation(infraSoundSignal)); featureLabels.add("infraSTDEV");
		features.add(standardDeviation(ultraSoundSignal)); featureLabels.add("ultraSTDEV");
		
		// Spectral Band Ratios
		float[] infraSoundSpectralBandRatio = spectralBandRatio(infraSoundSignal);
		float[] ultraSoundSpectralBandRatio = spectralBandRatio(downSample(extractUltraSound(fft), 28));
		for (int i=0; i<infraSoundSpectralBandRatio.length; i++) { features.add(infraSoundSpectralBandRatio[i]); featureLabels.add("infraBandRatio"+i); }
		for (int i=0; i<ultraSoundSpectralBandRatio.length; i++) { features.add(ultraSoundSpectralBandRatio[i]); featureLabels.add("ultraBandRatio"+i); }
		
		// Derivatives
		float[] ultraSoundSignal112 = downSample(extractUltraSound(fft), 112);
		float[] derivatives = derivative(ultraSoundSignal112);
		for (int i=0; i<derivatives.length; i++) { features.add(derivatives[i]); featureLabels.add("ultraDerivatives"+i); }
		
		// Third Octaves
		float[] thirds = thirdOctaves(fft);
		for (int i=0; i<thirds.length; i++) {features.add(thirds[i]); featureLabels.add("ultraThirdOctaves" +i);  }
		
		// Spectral Band Ratio of Octaves
		float[] thirdsOctaveSpectralBand = spectralBandRatio(thirds);
		for (int i=0; i<thirdsOctaveSpectralBand.length; i++) { features.add(thirdsOctaveSpectralBand[i]); featureLabels.add("ultraThirdOctavesBandRatio"+i); } 
				
		// That's it!
		return(features);
	}
	
	public float[] extractInfraSound(FFT fft) 
	{
		int start_indx = fft.freqToIndex(InfraSound.start);
		int end_indx = fft.freqToIndex(InfraSound.end);
		
		/* Grab FFT Values. Store into an ArrayList to avoid nasty IndexExceptions */
		ArrayList<Float> fftValues = new ArrayList<Float>();	
		for (int i=start_indx; i<end_indx; i++) {
			fftValues.add(fft.getBand(i));
		}
		
		return arrayListToFloatArray(fftValues);
	}
	
	public float[] extractUltraSound(FFT fft) 
	{
		int start_indx = fft.freqToIndex(UltraSound.start);
		int end_indx = fft.freqToIndex(UltraSound.end);
		
		/* Grab FFT Values. Store into an ArrayList to avoid nasty IndexExceptions */
		ArrayList<Float> fftValues = new ArrayList<Float>();	
		for (int i=start_indx; i<end_indx; i++) {
			fftValues.add(fft.getBand(i));
		}
		
		float[] result = new float[fftValues.size()];
		int i = 0;
		for (Float f : fftValues) {
			result[i++] = (f != null ? f : Float.NaN);
		}
		
		return result;
	}
	
	public float RMS(float[] signal) {
		float sum = 0;
		for (int i=0; i<signal.length; i++) {
			sum += signal[i]*signal[i];
		}
		return (float)Math.sqrt(sum/signal.length);
	}
	
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
				result[current_index] = result[current_index]/subSampleCount;
				current_index = index;
				subSampleCount = 1;
			}
			
		}
		
		// Perform this for the very last downsample band
		result[current_index] = result[current_index]/subSampleCount;
		return result;
	}
	
	public float centerOfMass(float[] signal)
	{
		float totalCount = 0;
        float totalSum = 0;

        for (int index = 0;index<signal.length;index++)
        {
            totalCount += signal[index];
            totalSum += index * signal[index];
        }

        return (float)totalSum/totalCount;
	}
	
	public int maxIndex (float[] signal)
	{
		float mx = Float.MIN_VALUE;
		int mx_indx = 0;
		for (int i=0; i<signal.length; i++) {
			if (signal[i]>mx) {
				mx = signal[i];
				mx_indx = i;
			}
		}
		return mx_indx;
	}
	
	public int minIndex(float[] signal)
	{
		float mn = Float.MAX_VALUE;
		int mn_indx = 0;
		for (int i=0; i<signal.length; i++) {
			if (signal[i]<mn) {
				mn = signal[i];
				mn_indx = i;
			}
		}
		return mn_indx;
	}
	
	public float average(float[] signal) {
		float avg = 0;
		for (int i=0; i<signal.length; i++) {
			avg += signal[i];
		}
		return (avg/signal.length);
	}
	
	public float standardDeviation(float[] signal) {
		float avg = average(signal);
		float sum = 0;
		for (int i=0; i<signal.length; i++)
		{
			sum += Math.pow(signal[i]-avg, 2);
		}		
		return (float)sum/(signal.length);
	}
	
	public float[] spectralBandRatio(float[] signal) {
		// Add ratio as features
		ArrayList<Float> ratios = new ArrayList<Float>();
		for (int i=0; i<signal.length; i++)
		{
		  for (int j=i+1; j<signal.length; j++)
		  {
			  ratios.add((1+signal[i])/(1+signal[j]));
		  }
		}
		return arrayListToFloatArray(ratios);
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
	
	public float zeroCrossings(float[] timeSignal)
	{
		float zeroCrossings = 0;
		for(int i=1; i<timeSignal.length; i++)
		{
			if (Math.signum(timeSignal[i])*Math.signum(timeSignal[i-1])<0) {
				zeroCrossings += 1;
			}
		}
		return zeroCrossings;
	}
	
	public float[] derivative(float[] signal)
	{
		float[] derivatives = new float[signal.length-1];
		for (int i=1; i<signal.length; i++) {
			derivatives[i-1] = signal[i] - signal[i-1];
		}
		return derivatives;
	}
	
	public float[] thirdOctaves(FFT fft)
	{
		float baseFreq = UltraSound.start;
		float mean_octave1 = 0;
		float mean_octave2 = 0;
		float mean_octave3 = 0;
		
		int indxBase = fft.freqToIndex(baseFreq);
		int indxOctave1 = fft.freqToIndex(25000);
		int indxOctave2 = fft.freqToIndex(32000);
		int indxOctave3 = fft.freqToIndex(40000);
		
		float count = 0;
		for (int i=indxBase; i<indxOctave1; i++) {
			mean_octave1 += fft.getBand(i);
			count += 1;
		}
		mean_octave1 = mean_octave1/count;
		
		count = 0;
		for (int i=indxOctave1; i<indxOctave2; i++) {
			mean_octave2 += fft.getBand(i);
			count += 1;
		}
		mean_octave2 = mean_octave2/count;
		
		count = 0;
		for (int i=indxOctave2; i<indxOctave3; i++) {
			mean_octave3 += fft.getBand(i);
			count += 1;
		}
		mean_octave3 = mean_octave3/count;
		
		float[] result =  {mean_octave1, mean_octave2, mean_octave3};
		return result;
	}
	
	
}
