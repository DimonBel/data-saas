# SaaS Data Enrichment Application

## Project Overview
The **SaaS Data Enrichment Application** automates the process of managing and enriching datasets related to individuals and organizations. Users can upload datasets, match columns to predefined fields, enrich data using external APIs, and receive cost estimates before proceeding. This project is built with scalability in mind, using a modern tech stack and containerized deployment.

## Key Features
- **Authentication**: Secure login with Google OAuth (via NextAuth).
- **Dataset Upload**: Supports CSV/Excel formats.
- **Column Matching**: AI-assisted column matching to predefined fields.
- **Data Enrichment**: Automated enrichment via LinkedIn and Veriphone APIs.
- **Cost Estimation**: Real-time cost calculation based on selected enrichment fields and dataset size.
- **Data Export**: Download enriched datasets in CSV or Excel formats.
  
## Tech Stack
- **Frontend**: 
  - [Next.js](https://nextjs.org/) (v14.2.7)
  - [Ant Design](https://ant.design/) (v5.9.0)
  - [TypeScript](https://www.typescriptlang.org/) (v5.2.2)
- **Backend**:
  - [Strapi](https://strapi.io/) (v4.25.7)
  - [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: 
  - [NextAuth](https://next-auth.js.org/) (v4.13.0) with Google OAuth.
- **Containerization**: 
  - [Docker](https://www.docker.com/) (v24.0.6) and Docker Compose.
- **APIs**: LinkedIn, Veriphone for data enrichment.

## Installation

### Prerequisites
- Docker and Docker Compose.
- Google OAuth credentials from the [Google Cloud Console](https://console.cloud.google.com/).

### Steps
1. **Clone the repository**:
    ```bash
    git clone https://github.com/stajilov/data_saas
    cd data_saas
    ```

2. **Create `.env.local`** with the following environment variables:
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:1337/api
    NEXT_PUBLIC_BACKEND_URL=http://localhost:1337/api/
    NEXTAUTH_URL=http://localhost:3000
    AUTH_GOOGLE_ID=your-google-client-id
    AUTH_GOOGLE_SECRET=your-google-client-secret
    NEXT_PUBLIC_API_VERIPHONE=your-veriphone-api-key
    NEXT_PUBLIC_API_LINKEDIN=your-linkedin-api-key
    AUTH_SECRET=your-auth-secret
    ```

3. **Start the application**:
    ```bash
    docker-compose up --build
    ```

4. **Access the application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend (Strapi): [http://localhost:1337](http://localhost:1337)

### Stopping the application
To stop all running containers:
```bash
docker-compose down
```
## Usage
- **Login**: Authenticate using Google OAuth.
- **Upload Dataset**: Upload a CSV or Excel file.
- **Column Matching**: Map columns to predefined fields (e.g., Name, Email, Role).
- **Enrich Data**: Select fields for enrichment using APIs.
- **Download**: Get enriched datasets in CSV/Excel format.

## Environment Configuration
Ensure that you have the following environment variables in your `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:1337/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:1337/api/
NEXTAUTH_URL=http://localhost:3000
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
NEXT_PUBLIC_API_VERIPHONE=your-veriphone-api-key
NEXT_PUBLIC_API_LINKEDIN=your-linkedin-api-key
AUTH_SECRET=your-auth-secret
```
Replace the placeholders with actual values.  

## API Documentation

### Authentication

**Google OAuth Login**

* **Endpoint**: `/api/auth/google`
* **Method**: `GET`
* **Description**: Initiates the Google OAuth flow for user authentication.

### Dataset Upload

**Upload Dataset**

* **Endpoint**: `/api/upload`
* **Method**: `POST`
* **Description**: Uploads a dataset in CSV/Excel format.

### Column Matching

**Analyze and Match Columns**

- **Endpoint**: `/api/together`
- **Method**: `GET`
- **Description**: Uses Together API to analyze and match columns in a JSON dataset and return an enriched dataset with updated columns.

### Data Enrichment

**Enrich Data**

* **Endpoint**: `/api/enrich`
* **Method**: `POST`
* **Description**: Select fields for enrichment and retrieve additional data from external APIs.

For a full list of API endpoints and parameters, refer to the API documentation.

## Branching Strategy

We follow Git Flow:

* **Main**: The stable, production-ready branch.
* **Develop**: The branch for ongoing development.
* **Feature branches**: For new features (e.g., `feature/data-enrichment`).
* **Hotfix branches**: For urgent fixes applied to production (e.g., `hotfix/fix-error`).

### Creating a new feature branch:

```bash
git checkout -b feature/your-feature-name
```
Once the feature is complete, push your changes and open a Pull Request (PR).

### Merging a feature:

* Ensure all tests pass.
* Open a PR for review.
* Merge into `main` after approval.

### For urgent fixes:

```bash
git checkout -b hotfix/your-fix-name
```

Open a PR to merge into both `main` after resolving the issue.

## Contributors

* **Dmitrii Belîh** - Software Engineer
* **Mihaela Catan** - Software Engineer
* **Sabina Popescu** - Software Engineer
* **Mentor**: **Vladimir Stajilov** (CTO, CyberWhale)
