
#### **Project Overview**
The goal of this project is to develop a SaaS application that allows users to upload datasets related to organizations or people, match columns within the dataset, and enrich the data using AI-driven prompts. The application will estimate the cost of data enrichment before proceeding. The platform will be built using modern technologies, ensuring scalability, maintainability, and ease of use.

#### **Tech Stack**
- **Frontend:** Next.js, NextAuth, Ant Design, TypeScript
- **Backend:** Strapi
- **Containerization:** Docker
- **CI/CD:** GitHub Actions (or similar) for continuous integration and deployment

#### **Key Features**

1. **User Authentication**
   - Implement user authentication using NextAuth.
   - Users can sign up, log in, and manage their profiles.

2. **Dataset Upload**
   - Users can upload datasets in CSV or Excel format.
   - The dataset may include details such as organization names, people, email addresses, roles, phone numbers, etc.

3. **Data Preview and Column Matching**
   - Upon upload, the dataset is parsed and displayed in a preview mode.
   - The UI will allow users to match the uploaded dataset's columns with predefined fields (e.g., Name, Email, Role).
   - This column mapping is critical for accurate data enrichment.

4. **Data Enrichment**
   - After matching columns, users can choose which fields they want to enrich (e.g., Email, Role, Company, Phone Number).
   - Enrichment will be powered by GPT via a ChatGPT/Together AI integration.
   - The user can input specific prompts to fine-tune the enrichment process.
   - The system should generate a JSON schema for the enrichment process to standardize the output.

5. **Cost Estimation**
   - Before proceeding with data enrichment, the system will calculate an approximate cost based on the number of fields to be enriched and the volume of data.
   - Display the cost to the user and allow them to confirm or modify their enrichment request.

6. **Final Data Storage**
   - Once the user confirms the enrichment, the system will proceed and store the enriched dataset in Strapi.
   - Users can download the enriched dataset or view it in the platform.

7. **CI/CD Integration**
   - Set up continuous integration and deployment pipelines using GitHub Actions or a similar tool.
   - Automated testing and deployment upon merging to the main branch.

#### **Project Phases**

1. **Phase 1: Initial Setup**
   - Set up the project repository and basic CI/CD pipeline.
   - Initialize the frontend (Next.js, NextAuth, AntD) and backend (Strapi).
   - Dockerize the application.

2. **Phase 2: User Authentication**
   - Implement user sign-up, login, and profile management.

3. **Phase 3: Dataset Upload & Column Matching**
   - Implement dataset upload functionality.
   - Develop the UI for dataset preview and column matching.

4. **Phase 4: Data Enrichment**
   - Integrate GPT for data enrichment.
   - Implement the cost estimation feature.

5. **Phase 5: Finalization**
   - Store the enriched data in Strapi.
   - Develop download and view features for the enriched dataset.

6. **Phase 6: Testing & Deployment**
   - Write unit and integration tests.
   - Finalize the CI/CD pipeline for production deployment.

7. **Phase 7: Documentation & Handover**
   - Document the entire system, including API documentation, user guides, and developer setup instructions.
   - Handover the project with a final presentation.

#### **Expected Deliverables**
- A fully functional SaaS application with all the features mentioned above.
- A GitHub repository with a clear README and proper branching strategies.
- Documentation detailing the deployment process, API endpoints, and usage instructions.
- A presentation summarizing the project, challenges faced, and solutions implemented.

#### **Evaluation Criteria**
- Code quality and adherence to best practices.
- User experience and interface design.
- Functionality of all features, especially dataset upload, column matching, and data enrichment.
- Effectiveness of the CI/CD pipeline.
- Completeness of documentation.

This project provides a comprehensive real-world experience in developing a SaaS application using modern web development practices, containerization, and CI/CD automation.
