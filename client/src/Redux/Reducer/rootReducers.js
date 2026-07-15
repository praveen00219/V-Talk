import { combineReducers } from "redux";

// reducers or storage units
import auth from "./Auth/auth.reducer";
import user from "./User/user.reducer";
import chat from "./Chat/chat.reducer";
import message from "./Message/message.reducer";
import profileImage from "./ProfileImage/profileImage.reducer";
import themeReducer from "./Theme/theme.reducer";
import tabReducer from "./Tab/tabReducer";
import setColorReducer from "./SetColor/setColorReducer"
import presence from "./Presence/presence.reducer";
import wallpaperReducer from "./Wallpaper/wallpaper.reducer";

const rootReducer = combineReducers({
  auth,
  user,
  profileImage,
  chat,
  message,
  themeReducer,
  tabReducer,
  setColorReducer,
  presence,
  wallpaperReducer,
});

export default rootReducer;
