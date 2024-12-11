/* eslint-disable react/prop-types */
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import axios from "axios";

export default function MultiActionAreaCard({ profile, initialRequestSent, handleRedirect }) {
  const [requestSent, setRequestSent] = useState(initialRequestSent);

  const handleConnect = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/connections",
        { receiverId: profile.user_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRequestSent(true); // Mark the request as sent
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert("Failed to send connection request.");
    }
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardActionArea onClick={() => handleRedirect(profile.username)}> {/* Call handleRedirect */}
        {/* Profile Picture */}
        {profile.profile_image ? (
          <CardMedia
            component="img"
            height="140"
            image={profile.profile_image}
            alt={profile.username}
            sx={{
              borderRadius: "50%",
              width: "140px",
              height: "140px",
              margin: "auto",
              objectFit: "cover",
            }}
          />
        ) : (
          <CardMedia
            component="div"
            sx={{
              width: "140px",
              height: "140px",
              backgroundColor: "#e0e0e0",
              borderRadius: "50%",
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h3" color="textSecondary">
              {profile.username?.[0]?.toUpperCase() || "U"}
            </Typography>
          </CardMedia>
        )}

        {/* User Info */}
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            align="center"
            sx={{ fontWeight: "bold" }}
          >
            {profile.username}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {profile.role ? `Role: ${profile.role}` : "Role not specified"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {profile.skills ? `Skills: ${profile.skills}` : "No skills added"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {profile.interests ? `Interests: ${profile.interests}` : "No interests added"}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* Connect Button */}
      <CardActions>
        {requestSent ? (
          <Button
            size="small"
            disabled
            fullWidth
            sx={{
              fontWeight: "bold",
              backgroundColor: "#e0e0e0",
              color: "gray",
              cursor: "not-allowed",
            }}
          >
            Request Sent
          </Button>
        ) : (
          <Button
            size="small"
            color="primary"
            onClick={handleConnect}
            fullWidth
            sx={{ fontWeight: "bold" }}
          >
            Connect
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
