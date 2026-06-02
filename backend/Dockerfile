# Use a lightweight Python image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file first
COPY requirements.txt .

# Install all Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the backend code
COPY . .

# Tell Docker which port the app runs on
EXPOSE 8000

# Command to start the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]