const Events = Object.freeze({
  Auth_Login: 1,
  Auth_Logout: 2,
  Auth_Unauthorized: 3,
  Redirect: 4,
  User_RequestAction: 5,
  API_RequestStarted: 100,
  API_RequestEnded: 101,

  Dashboard_ReloadRooms: 200,
  Dashboard_ReloadAttributes: 200,
  Dashboard_ReloadUsers: 200,
});

export default Events;
