
import java.util.Random;

import weka.classifiers.Evaluation;
import weka.classifiers.functions.SMO;
import weka.classifiers.functions.SMOreg;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.OptionHandler;
import weka.core.Utils;
import weka.core.converters.ConverterUtils.DataSource;


public class WekaClassifier
{
	SMO cls;
	Instances trainingdata;
	
	// Creates a weka classifier from a training file or pre-built model.
	// params:
	//   trainingFile: the file to load.
	//   isModel: Whether the file is actually a model
	public WekaClassifier(String trainingFile)
	{
		try
		{		
			DataSource trainingSource = new DataSource(trainingFile);
			trainingdata = trainingSource.getDataSet();
			
			//DataSource testingSource = new DataSource("data/all2.csv");
			//Instances testingData = testingSource.getDataSet();
			
			//System.out.println(trainingdata.numAttributes());
			//System.out.println(testingData.numAttributes());
			
			trainingdata.setClassIndex(trainingdata.numAttributes() - 1);
			//testingData.setClassIndex(testingData.numAttributes() - 1);
			
			cls = new SMO();
			
			cls.buildClassifier(trainingdata);
			
			Evaluation eval = new Evaluation(trainingdata);
			
			 eval.crossValidateModel(cls, trainingdata,10, new Random(1));
			
			 System.out.println(eval.toClassDetailsString());
			 System.out.println(eval.toMatrixString());
			 System.out.println(eval.toSummaryString());
			 
			 weka.core.SerializationHelper.write(trainingFile+".model", cls);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
	
	/*
	public WekaClassifier(String trainingFile, String modelFile){
		// Load training data
		DataSource trainingSource;
		try {
			trainingSource = new DataSource(trainingFile);
			trainingdata = trainingSource.getDataSet();
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		
		//DataSource testingSource = new DataSource("data/all2.csv");
		//Instances testingData = testingSource.getDataSet();
		
		//System.out.println(trainingdata.numAttributes());
		//System.out.println(testingData.numAttributes());
		
		trainingdata.setClassIndex(trainingdata.numAttributes() - 1);
		
	
	}
	*/
	
	public WekaClassifier(String trainingFile, String modelFile) {
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
			cls = (SMO) weka.core.SerializationHelper.read(modelFile);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	
	public int classifyGesture(float[] features)
	{
		Instance instance = new Instance(features.length);
		instance.setDataset(trainingdata);
		
		//System.out.println(features.length);
		int gestureID = -1;
		
		for (int i=0;i<features.length;i++)
			instance.setValue(i,features[i]);
		
		try 
		{
			gestureID = (int) cls.classifyInstance(instance);
			
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
