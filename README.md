

# Restaurant-Ordering-System



## Source Files:
    1. README.txt
    2. scripts folder with all the client javascript files
    3. server.js
    4. styles folder with all css style files.
    5. images folder with all the images that the program used.
    6. database-initializer.js(the original one)
    7. views folder with pages folder and partials folder.
    8. package.json to manage all dependencies
    9. order-router.js
    10.order-schema.js
    11.register-router.js
    12.user-schema.js
    13.users-router.js


## Instruction:

    1.make sure the mongodb is running using command:
      mongod --dbpath=<database folder>
      Or using brew services list(for macOS)
      If encounter network connection refused error: change all localhost to 127.0.0.1 in the database-initializer.js and server.js

      If mongoldb is not running, use following command to start mongoldb server:
      brew services start mongodb-community@6.0

    2.*****IMPORTANT*****
      before running the program, make sure to set up the a4 database using
      node database-initializer.js
      'npm install' to install all necessary dependencies in the directory where the server.js is.

    3. once all these are done, we can run the server using command:\
        node server.js
       and you will see a message: Server running at http://127.0.0.1:3000/
    4. once server is successful, open the browser of your choice and navigate to http://127.0.0.1:3000/ and you
       will see the welcome login page displayed.
    5. The top of the page is the header which allows you to navigate through home, users, login and register.
    6. users tab showing all the current users stored in the database a4 the users collection, you can click the page to the specific
       users and will be able to change the privacy mode for that users.
    7. Once the submit changes button is clicked, all the changes made will be sent to server and gets updated in the database.
    8. register tab allow you to add users with unique ID, and redirect it to the /users/:uid page to edit as loggedin user.
    9.Once the user loggedin, it can choose to changed its own profile privacy mode and it will be stored in the database. It can also
       choose to place order and saved to the database a4 under orders collection.
    10.The logout tab will log user out from the system, and all those private profiles and orders will not be accessed by user.
    11.use command "control+c" to interrupt the running server process and all new users and orders added will still be stored in the
       database a4.
    12.If you want to reset the database, rerun
        node database-initializer.js
        and in database tokens, in the mongodb shell:
          use tokens
          db.dropDatabase()
       all data will be reset to what's in the database-initializer.js

## Design:
    A simple order management page allow users to logged in, register, view users'profile and to place order.
    *****Not Logged In*****
    users can view all the current public users and his/herself by clicking the users tab.
    All current users will show with a link to the specific user profile page using users tab with query string functionality.
    Once the user clicked the link, he/she will be directed to the page which has public profile, and all the orders that placed by
    that users.
    users can register through register tab, and will automatically logged if successful and redirected to current user's profile.
    users with duplicate names will not be allowed to register.
    *****Logged In*****
    Users logged in the home page can access your own profile using tab view your profile and change its privacy mode which sets to
    public by default.
    users can also place order for his/herself and later review the order summary in the view your profile page.
    The private user's profile and orders can only be viewed by his/herself, any one does not have an acess to the profiles or order
    summaries will receive a 403 error.
    Only the loggedin user will be able to access the to order page and place order.
    The logout tab will log out the current user, if you need to go back as current user, you have to log in again.
                                          ****Note****
    A private user's profile can show in the users tab if the current private user is logged in, Once he/she logs out, the current
    private user's profile will be removed from the users tab.


## All the picture references:
    menubackground.jpg
    https://www.youworkforthem.com/photo/140991/fruit-berries-food-background-on-white-marble
