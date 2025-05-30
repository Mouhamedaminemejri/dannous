from typing import Dict, List, Tuple
import json
from datetime import datetime
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

class ModelEvaluator:
    def __init__(self):
        self.metrics = {
            'response_accuracy': [],
            'language_detection_accuracy': [],
            'translation_quality': [],
            'response_time': [],
            'user_satisfaction': []
        }
        
    def evaluate_language_detection(self, 
                                  predicted_langs: List[str], 
                                  actual_langs: List[str]) -> Dict:
        """
        Evaluate language detection accuracy.
        """
        accuracy = accuracy_score(actual_langs, predicted_langs)
        precision = precision_score(actual_langs, predicted_langs, average='weighted')
        recall = recall_score(actual_langs, predicted_langs, average='weighted')
        f1 = f1_score(actual_langs, predicted_langs, average='weighted')
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1
        }

    def evaluate_translation_quality(self, 
                                   original_texts: List[str],
                                   translated_texts: List[str],
                                   target_lang: str) -> Dict:
        """
        Evaluate translation quality using various metrics.
        """
        # This is a simplified version. In practice, you would use more sophisticated
        # metrics like BLEU, METEOR, or human evaluation
        results = {
            'length_ratio': [],
            'character_overlap': []
        }
        
        for orig, trans in zip(original_texts, translated_texts):
            # Length ratio
            results['length_ratio'].append(len(trans) / len(orig))
            
            # Character overlap
            overlap = len(set(orig) & set(trans)) / len(set(orig) | set(trans))
            results['character_overlap'].append(overlap)
        
        return {
            'avg_length_ratio': np.mean(results['length_ratio']),
            'avg_character_overlap': np.mean(results['character_overlap'])
        }

    def evaluate_response_time(self, response_times: List[float]) -> Dict:
        """
        Evaluate response time performance.
        """
        return {
            'mean_response_time': np.mean(response_times),
            'median_response_time': np.median(response_times),
            'p95_response_time': np.percentile(response_times, 95),
            'max_response_time': max(response_times)
        }

    def evaluate_user_satisfaction(self, 
                                 satisfaction_scores: List[int]) -> Dict:
        """
        Evaluate user satisfaction based on feedback scores.
        """
        return {
            'mean_satisfaction': np.mean(satisfaction_scores),
            'satisfaction_distribution': {
                'very_satisfied': sum(1 for s in satisfaction_scores if s >= 4),
                'satisfied': sum(1 for s in satisfaction_scores if s == 3),
                'dissatisfied': sum(1 for s in satisfaction_scores if s <= 2)
            }
        }

    def save_evaluation_results(self, results: Dict, filename: str) -> None:
        """
        Save evaluation results to a file.
        """
        results['timestamp'] = str(datetime.now())
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=4)

    def generate_evaluation_report(self, 
                                 all_metrics: Dict,
                                 output_file: str) -> None:
        """
        Generate a comprehensive evaluation report.
        """
        report = {
            'timestamp': str(datetime.now()),
            'overall_metrics': all_metrics,
            'summary': {
                'language_detection': {
                    'status': 'Good' if all_metrics['language_detection']['accuracy'] > 0.9 else 'Needs Improvement',
                    'accuracy': all_metrics['language_detection']['accuracy']
                },
                'translation_quality': {
                    'status': 'Good' if all_metrics['translation']['avg_character_overlap'] > 0.8 else 'Needs Improvement',
                    'quality_score': all_metrics['translation']['avg_character_overlap']
                },
                'response_time': {
                    'status': 'Good' if all_metrics['response_time']['mean_response_time'] < 2.0 else 'Needs Improvement',
                    'average_time': all_metrics['response_time']['mean_response_time']
                },
                'user_satisfaction': {
                    'status': 'Good' if all_metrics['user_satisfaction']['mean_satisfaction'] > 3.5 else 'Needs Improvement',
                    'satisfaction_score': all_metrics['user_satisfaction']['mean_satisfaction']
                }
            },
            'recommendations': self._generate_recommendations(all_metrics)
        }
        
        self.save_evaluation_results(report, output_file)

    def _generate_recommendations(self, metrics: Dict) -> List[str]:
        """
        Generate recommendations based on evaluation metrics.
        """
        recommendations = []
        
        # Language detection recommendations
        if metrics['language_detection']['accuracy'] < 0.9:
            recommendations.append(
                "Improve language detection accuracy by adding more training data "
                "and fine-tuning the detection model."
            )
        
        # Translation quality recommendations
        if metrics['translation']['avg_character_overlap'] < 0.8:
            recommendations.append(
                "Enhance translation quality by implementing more sophisticated "
                "translation models and adding domain-specific terminology."
            )
        
        # Response time recommendations
        if metrics['response_time']['mean_response_time'] > 2.0:
            recommendations.append(
                "Optimize response time by implementing caching and improving "
                "API response handling."
            )
        
        # User satisfaction recommendations
        if metrics['user_satisfaction']['mean_satisfaction'] < 3.5:
            recommendations.append(
                "Improve user satisfaction by enhancing response quality and "
                "implementing better error handling."
            )
        
        return recommendations 