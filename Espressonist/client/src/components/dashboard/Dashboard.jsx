import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Box, Typography, Card, CardContent, CardActions} from '@mui/material';
import { Link } from 'react-router-dom';

// The Component Dashboard  sets the initial state of coffeeEntries as an empty array, and userId as the user_id value  from local storage.
const Dashboard = () => {
const [coffeeEntries, setCoffeeEntries] = useState([]); 



//userId is initialized to the value of the (user_id) key in the browser's localStorage using useState. This value will be used later to filter and display only the coffee entries added by the current user.
  const [userId] = useState(localStorage.getItem('user_id'));


  //currentUser is initialized to (null) using useState, It will store the information of the currently logged-in user, if any.
  const [currentUser, setCurrentUser] = useState(null);


  

  // console.log('UserID:', userId)


// fetchCoffeeEntriesfunction uses the "fetch" to retrieve all coffee entries from the backend server, and updates the (coffeeEntries)  variable with the retrieved data if the request is successful, otherwise an error message is printed to the console. The useCallback  is used to catch the function instance and reuse it across renders as it does not depend on props.


  // With FetchCoffeeEntries the useCallBack was added due to the coffees keep rendering on the console  so this way the it doesn't get recreated on every render.
  
  const fetchCoffeeEntries = useCallback(async () => {
  const url = `${baseURL}/getall/${userId}`;
  
    try {
      // GET request to the  endpoint for fetching all coffee entries associated with a particular user. The user ID isin the userId state above.
      const response = await fetch(url, {
        headers: new Headers({
          'Authorization': `${localStorage.getItem('token')}`,
        }),
        method: "GET"
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch coffee entries');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch coffee entries');
      }
    } catch (error) {
      console.error('Error fetching coffee entries:', error.message);
    }
  });

  // this calls the fetchCoffeeEntries function when the component mounts and whenever fetchCoffeeEntries or userId changes.
  useEffect(() => {
    fetchCoffeeEntries();
  }, []);



  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);


  

  const handleDeleteCoffee = async (id) => {
    const url = `${baseURL}/coffee/${id}`;
  
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete coffee entry');
      }
// this filters out the deleted coffee entry from the  coffeeEntries array, as well as any other entries that have the same user ID as the currently logged-in user, and updates the "coffeeEntries" state variable with the filtered array.

      setCoffeeEntries(coffeeEntries.filter(entry => entry._id !== id || (entry.user && entry.user._id !== userId)));

      //  alert on the page that coffee was deleted
      alert('Coffee entry deleted successfully!');
  
      console.log('Coffee entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting coffee entry:', error);
    }
  };
  
  


  return (
    // this changes the color of the background in dashboard
    <Box bgcolor="#A67C52" style={{ minHeight: "100vh" }}>
      
      <Container maxWidth="lg">
        <nav>
          <TemporaryDrawer />
        </nav>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Dashboard
        </Typography>
        <div>
          <br />
          <br />
          <br />
          <br />
          {/* this maps the array of coffeeEntries and renders a card for each onewith the
          delete and edit if the current user is authorized , also styles with a hover effect box-shadow */}
          {coffeeEntries.length > 0 ? (
            <Grid container spacing={4}>
              {coffeeEntries.map((coffee) => (
                // this makes the Grid  (@mui/material) saying how many columns at different screen sizes. the (key) gives each one a unique identifier.
                <Grid item xs={12} sm={6} md={4} lg={3} key={coffee._id}>
                  <Card
                    sx={{
                      marginBottom: 2,
                      transition: '0.3s',
                      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                      '&:hover': {
                        boxShadow: '0 0 20px rgba(0,0,0,0.9)',
                        transform: 'translateY(-6px)',
                      },
                    }}
                  >
                    {/* renders the details of a coffee entry using CoffeeDetails inside the cardContent  of a card */}
                    <CardContent>
                      <CoffeeDetails coffeeData={coffee} />
                    </CardContent>
                    <CardActions>
                      {/* check if there is a current user and if they are the creator or an admin if its true it renders delete and edin in the cards. */}
                      {currentUser && (coffee.userId === currentUser._id || currentUser.isAdmin) && (
                        <>
                          <button onClick={() => handleDeleteCoffee(coffee._id)}>Delete</button>
                          
                          <Link to={`/edit-coffee/${coffee._id}`}>
                            <button>Edit</button>
                          </Link>
                        </>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <p>No coffee entries yet. Add some!</p>
          )}
        </div>
      </Container>
    </Box>
  );
};

export default Dashboard;


