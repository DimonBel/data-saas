# Changelog

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
