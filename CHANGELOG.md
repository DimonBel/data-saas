# Changelog

### November 8, 2024

### Payment Feature

**Sabina (Frontend - Payment Feature)**  
- **Design Payment UI**: A user-friendly interface was developed for payment inputs, buttons, and layout to streamline the payment experience.
- **Frontend Payment Integration**: The frontend is now connected to backend payment processing endpoints, enabling seamless handling of user inputs and transaction responses.
- **UI Testing**: Comprehensive tests were conducted to ensure the payment interface works consistently across devices and browsers.

**Mihaela (Backend - Payment Feature)**  
  - **Content-type Creation**: Created a new **CreditPackage** Collection Type in Strapi, enabling users to purchase credit packages for enrichment tasks.
  - **Cost Definition**: Defined the cost of one row of enrichment as **1 credit**.
  - **Credit Package Component**: Began development of the **CreditPackage** component to display available credit packages.
  - **Service Development**: Implemented a getCreditPackages service to get packages from the backend.
  - **Frontend Payment**: Started defining a simple page to display packages.

- **Available Credit Packages**:
  - **Basic Package**: 100 credits for $10
  - **Standard Package**: 500 credits for $15
  - **Premium Package**: 1000 credits for $20
![image](https://github.com/user-attachments/assets/be509220-04c4-484a-8193-61309b280de4)
![image](https://github.com/user-attachments/assets/f12f3d67-9808-4acf-9e73-5235aa64b7be)




### History and Dataset Management

**Mada (History and Dataset Storage)**  
- **User-Specific Dataset History Storage**: Structured the database for efficient user-specific dataset storage.
- **Optimize Database for History Retrieval**: Enhanced database indexing to allow faster access to user history.
- **Testing User Access Restrictions**: Validated that users can only access their own datasets through rigorous security and access tests.

**Dima (History and Dataset Management)**  
- **Develop History Retrieval Logic**: Implemented backend endpoints to manage user-specific dataset history retrieval.
- **Coordinate API for Dataset Storage and Retrieval**: Streamlined API calls to sync with Mada’s database structure for seamless data storage and access.
- **Code Review and Refinement**: Conducted code reviews to ensure optimal integration and performance across dataset management.

#### Questions or Concerns?
For any questions or further assistance with these updates, please reach out to our support team or refer to our documentation.
