Before you begin, make sure you have the following installed:

- Python (3.6 or higher)
- Virtualenv (for managing Python environments)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/Anou-shka/SC2006-Software-Eng.git

2. Navigate to venv using cd venv
3. Create a virtual environment and activate it:
   python -m venv venv
   source venv/bin/activate   # On Windows, use 'venv\Scripts\activate'
4. Install project dependencies:
   pip install -r requirements.txt
   
## Database Setup

1. Apply database migrations:
   python manage.py migrate
2. Create a superuser account for the admin panel:
   python manage.py createsuperuser

## Running the Application
Start the development server:
python manage.py runserver
Your Django application will be accessible at http://127.0.0.1:8000/.
   
## Admin Panel
You can access the admin panel at http://127.0.0.1:8000/admin/ with the superuser account you created.

   
