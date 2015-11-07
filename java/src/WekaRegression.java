
import java.util.Random;

import weka.classifiers.Evaluation;
import weka.classifiers.functions.SMOreg;
import weka.classifiers.functions.supportVector.RBFKernel;
import weka.classifiers.functions.supportVector.RegOptimizer;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;


public class WekaRegression
{
	SMOreg reg;
	Instances trainingdata;
	
	// Creates a weka classifier from a training file or pre-built model.
	// params:
	//   trainingFile: the file to load.
	//   isModel: Whether the file is actually a model
	public WekaRegression(String trainingFile)
	{
		try
		{		
			DataSource trainingSource = new DataSource(trainingFile);
			System.out.println("Training " + trainingFile + " ...");
			trainingdata = trainingSource.getDataSet();					
			trainingdata.setClassIndex(trainingdata.numAttributes() - 1);
			
			RBFKernel kernel = new RBFKernel();
			kernel.setCacheSize(250007);
			kernel.setGamma(0.01);
			
			reg = new SMOreg();
			reg.setKernel(kernel);
						
			float percent = 90.0f;
			int trainSize = (int) Math.round(trainingdata.numInstances() * percent/ 100);
			int testSize = trainingdata.numInstances() - trainSize;
			
			trainingdata.randomize(new java.util.Random(0));
			Instances train = new Instances(trainingdata, 0, trainSize);
			Instances test = new Instances(trainingdata, trainSize, testSize);
			
			reg.buildClassifier(train);
			Evaluation eval = new Evaluation(test);
			
			//eval.crossValidateModel(reg, trainingdata, 4, new Random(1));
			eval.evaluateModel(reg, test);
			System.out.println(eval.toSummaryString());
			
			// Serialize the CLassifier model
			weka.core.SerializationHelper.write(trainingFile+".model", reg);
			
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	
	/*
	public WekaRegression(String trainingFile, String modelFile){
		// Load training data
		DataSource trainingSource;
		try {
			trainingSource = new DataSource(trainingFile);
			trainingdata = trainingSource.getDataSet();
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		
		trainingdata.setClassIndex(trainingdata.numAttributes() - 1);
	}
	*/
	
	public WekaRegression(String trainingFile, String modelFile) {
		DataSource trainingSource;
		try {
			trainingSource = new DataSource(trainingFile);
			trainingdata = trainingSource.getDataSet();
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		trainingdata.setClassIndex(trainingdata.numAttributes() - 1);
		try {
			System.out.println("Loading Model " + modelFile + " ...");
			reg = (SMOreg) weka.core.SerializationHelper.read(modelFile);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public double classifyGesture(float[] features)
	{
		Instance instance = new Instance(features.length);
		instance.setDataset(trainingdata);

		double gestureID = -1;
		
		for (int i=0;i<features.length;i++)
			instance.setValue(i,features[i]);
		
		try 
		{
			gestureID = (double) reg.classifyInstance(instance);
			
		} 
		catch (Exception e) 
		{
			System.out.println(e.getLocalizedMessage());
			System.out.println(e.getMessage());
			e.printStackTrace();
		}
		
		return gestureID;
	}
}
