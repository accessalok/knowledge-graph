Create a virtual environment (optional but recommended):

1.Creating a virtual environment isolates your project's dependencies from the system-wide packages. Run the following commands in your project directory:

python3 -m venv venv
source venv/bin/activate   # On Windows, use `venv\Scripts\activate`

2.Install Flask and other dependencies:
Ensure you have a requirements.txt file with the necessary dependencies. Here's the content of requirements.txt:

pip install -r requirements.txt
3.Run the Flask application:

python app.py

4.If you encounter further issues, ensure your Python environment is correctly set up and you are using the correct Python interpreter. You can verify the installation and check the installed packages by running:

pip list
This command should list Flask and pandas among the installed packages.
