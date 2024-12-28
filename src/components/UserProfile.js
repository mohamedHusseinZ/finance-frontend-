import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = ({ token }) => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.log("Error fetching user profile", error);
      }
    };

    fetchUser();
  }, [token]);

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <div>
      <h2>User Profile</h2>
      <ProfilePicture user={user} token={token} />
      {isEditing ? (
        <EditProfileForm
          user={user}
          token={token}
          onUpdateUser={handleUpdateUser}
        />
      ) : (
        <UserInfo user={user} onEdit={() => setIsEditing(true)} />
      )}
      <ChangePassword token={token} />
    </div>
  );
};

const UserInfo = ({ user, onEdit }) => {
  return (
    <div>
      <h3>Basic Information</h3>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <button onClick={onEdit}>Edit Profile</button>
    </div>
  );
};

const EditProfileForm = ({ user, token, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5000/user/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdateUser(response.data.user);
    } catch (error) {
      console.log("Error updating profile", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Profile</h3>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <button type="submit">Save Changes</button>
    </form>
  );
};

const ChangePassword = ({ token }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    try {
      await axios.put(
        "http://localhost:5000/user/change_password",
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully!");
    } catch (error) {
      console.log("Error updating password", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Change Password</h3>
      <input
        type="password"
        placeholder="Current Password"
        value={passwords.currentPassword}
        onChange={(e) =>
          setPasswords({ ...passwords, currentPassword: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="New Password"
        value={passwords.newPassword}
        onChange={(e) =>
          setPasswords({ ...passwords, newPassword: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={passwords.confirmPassword}
        onChange={(e) =>
          setPasswords({ ...passwords, confirmPassword: e.target.value })
        }
      />
      <button type="submit">Update Password</button>
    </form>
  );
};

const ProfilePicture = ({ user, token }) => {
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/user/upload_picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfilePicture(response.data.profilePicture);
    } catch (error) {
      console.log("Error uploading profile picture", error);
    }
  };

  return (
    <div>
      <h3>Profile Picture</h3>
      <img src={profilePicture} alt="Profile" width={100} height={100} />
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default UserProfile;
