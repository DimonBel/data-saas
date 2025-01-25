# Changelog

### January 21, 2025

### Payment Feature
 
**Mihaela (FullStack - Payment Feature)**  
  - **Database Integration**: Implemented the credits record for users in the database.  
  - **UI Enhancements**:  
    - Created an element to display the number of credits.  
    - Improved several UI elements for better user experience.
    - Added loading spinner integration for better user feedback.  

  - **Credit Purchase**:  
    - Implemented the option to buy credits and update them in the backend.  
  - **Credit Usage**:  
    - Implemented credit subtraction when paying for data enrichment.

### November 22, 2024

**Dmitry (History and Dataset Management)**  
- Reviewed and revised the work completed in the previous week.  
- Fully implemented the defined scheme on **Strapi**.  
- Verified the functionality of the following server endpoints, including their returned data and correct POST request formats:  

  **Endpoints Tested:**  
  - **GET**:  
    `http://localhost:1337/api/enriches?populate=*`  
  - **GET**:  
    `http://localhost:1337/api/users/1?populate[enriches][populate]=linkedin,phone`  
  - **POST**:  
    `http://localhost:1337/api/enriches?populate=*`  

    **Example of POST Request:**  
    ```json
    {
      "data": {
        "linkedins": [1], // Replace with the ID of the LinkedIn entry
        "phones": [1], // Replace with the ID of the Phone entry
        "users_permissions_users": [1] // Replace with the ID of the User entry
      }
    }
    ```  

  - **GET**:  
    `http://localhost:1337/api/linkedins`  

- Confirmed the correct operation of endpoints and ensured they handle the required data properly.
### November 21, 2024

### Payment Feature
 
**Mihaela (Backend - Payment Feature)**  
  - **Error Solving**: Corrected the error messagess to be in English.
  - **Redirect**: Successfully implemented the redirect to the upload page after payment.

### November 13, 2024

### Payment Feature
 
**Mihaela (Backend - Payment Feature)**  
  - **Connection of Backend with Frontend**: Connected Sabina's UI to the backend for the payment feature.
  - **Stripe Connection**: Successfully connected Stripe to Strapi.
  - **Transaction Registration**: Successfully implemented the paying feature with transactions registered on stripe.com.
  ![image](https://github.com/user-attachments/assets/3999120a-eefa-4bad-88ef-4144429f42e0)
  ![image](https://github.com/user-attachments/assets/c79bee2c-b1e0-4b51-bc9e-816788540363)
  https://www.loom.com/share/bfecab869c954f639595f96d75328283?sid=f0d4fc8f-9795-4e13-9220-20c540ea4f12


### November 12, 2024

### Payment Feature

**Sabina (Payment UI Development)**:
  - Update PaymentPage to dark theme and adjust placeholder colors, add credit page for 3 types of packages
  - ![image](https://github.com/user-attachments/assets/1fc1a4a1-16e2-43d5-a0bb-0204b4c1bd3b)
 
**Mihaela (Backend - Payment Feature)**  
  - **Dynamic Rendering**: Connected Sabina's UI to the backend for the content type, enabling dynamic rendering of credit packages from backend data.

### November 8, 2024

### Payment Feature

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

- **Sabina (Payment UI Development)**:
  - **Completed the user interface** for the payment feature, incorporating fields for card details, expiration date, CVV, and auto-filled calculated amount based on user selections.
  - **Integrated styling** for the payment form to match the overall design.
  - **Implemented auto-fill functionality** in the `amount` field using the `calculateTotalCost` function. Ensured that the amount field displays the calculated value dynamically based on the number of rows and selected column type.
![image](https://github.com/user-attachments/assets/3c89ca18-b125-4b0e-b2ba-477e8a118ffb)


### History and Dataset Management

**Mada (History and Dataset Storage)**  
- **User-Specific Dataset History Storage**: Structured the database for efficient user-specific dataset storage.
- **Optimize Database for History Retrieval**: Enhanced database indexing to allow faster access to user history.
- **Testing User Access Restrictions**: Validated that users can only access their own datasets through rigorous security and access tests.

**Dima (History and Dataset Management)**  
- **Develop History Retrieval Logic**: Enhanced the enrich_data function by refining the database schema to ensure accurate representation and storage of enriched data. Implemented robust logic to save pre-enriched data in the database, improving data integrity and facilitating efficient retrieva

#### Questions or Concerns?
For any questions or further assistance with these updates, please reach out to our support team or refer to our documentation.
