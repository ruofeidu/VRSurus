import java.util.Random;

import weka.classifiers.Evaluation;
import weka.classifiers.trees.J48;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.OptionHandler;
import weka.core.Utils;
import weka.core.converters.ConverterUtils.DataSource;

public class WekaJ48 {
	J48 cls;
	Instances trainingdata;
	
	public WekaJ48(String trainingFile){
		try{
			DataSource trainingSource = new DataSource(trainingFile);
			trainingdata = trainingSource.getDataSet();
			trainingdata.setClassIndex(trainingdata.numAttributes() - 1);
			
			cls = new J48();
			cls.buildClassifier(trainingdata);
			
			Evaluation eval = new Evaluation(trainingdata);
			Random rand = new Random(1);  // using seed = 1
			int folds = 10;
			eval.crossValidateModel(cls, trainingdata, folds, rand);
			
			// Serialize the CLassifier model
			weka.core.SerializationHelper.write(trainingFile+".model", cls);
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public int classifyGesture(float[] features){
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
