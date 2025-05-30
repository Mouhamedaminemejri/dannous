from setuptools import setup, find_packages

setup(
    name="banking_chatbot",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        'flask==2.0.1',
        'python-dotenv==0.19.0',
        'requests==2.26.0',
        'openai==0.27.0',
        'langdetect==1.0.9',
        'googletrans==3.1.0a0',
        'nltk==3.6.3',
        'python-i18n==0.3.9',
        'numpy',
        'scikit-learn'
    ],
    python_requires='>=3.7',
) 