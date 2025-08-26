import React, { useState } from 'react';
import { 
  FiUser, FiPhone, FiMail, FiAward, 
  FiCalendar, FiMapPin, FiShield, 
  FiBriefcase, FiBook, FiClock, FiEdit2, FiSave
} from 'react-icons/fi';
import Header from './Header';
import './igprofile.css';

const IGProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Ghulam Nabi Memon",
    title: "Inspector General of Police",
    rank: "BS-21",
    batch: "16th Common",
    serviceYears: "30+ years",
    contact: "+92-21-99212654",
    email: "ig@sindhpolice.gov.pk",
    address: "IGP Office, Central Police Office, Karachi, Sindh",
    bio: "Highly decorated police officer with extensive experience in law enforcement and counter-terrorism operations across Sindh province.",
    education: [
      "MSc in Criminology - University of Karachi",
      "Bachelor of Laws (LLB) - Sindh University",
      "Police Training - National Police Academy"
    ],
    careerHighlights: [
      "Served as CCPO Karachi (2019-2021)",
      "Led counter-terrorism operations in Northern Sindh",
      "Implemented community policing initiatives",
      "Modernized police training programs"
    ],
    awards: [
      "Sitara-e-Imtiaz (2020)",
      "Quaid-e-Azam Police Medal (2018)",
      "President's Police Medal (2015)"
    ]
  });

  const handleChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  return (
    <>
      <Header />
      <div className="ig-profile-container">
        <div className="profile-header">
          <div className="profile-avatar"><span>IG</span></div>
          <div className="profile-titles">
            {editMode ? (
              <>
                <input
                  value={profileData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <input
                  value={profileData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </>
            ) : (
              <>
                <h1>{profileData.name}</h1>
                <h2>{profileData.title}</h2>
              </>
            )}
            <div className="profile-rank">{profileData.rank}</div>
          </div>
          <button 
            className="edit-btn"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? <FiSave /> : <FiEdit2 />}
            {editMode ? " Save" : " Edit"}
          </button>
        </div>

        <div className="profile-section">
          <h3 className="section-title"><FiUser /> Basic Information</h3>
          <div className="info-grid">
            {[
              { icon: <FiAward />, label: "Batch", field: "batch" },
              { icon: <FiCalendar />, label: "Service Years", field: "serviceYears" },
              { icon: <FiPhone />, label: "Contact", field: "contact" },
              { icon: <FiMail />, label: "Email", field: "email" },
              { icon: <FiMapPin />, label: "HQ Address", field: "address" },
            ].map(({ icon, label, field }, i) => (
              <div className="info-item" key={i}>
                <span className="info-icon">{icon}</span>
                <div>
                  <label>{label}</label>
                  {editMode ? (
                    <input
                      value={profileData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                    />
                  ) : (
                    <p>{profileData[field]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Sections (unchanged but can also be made editable similarly) */}
        <div className="profile-section">
          <h3 className="section-title"><FiShield /> Professional Bio</h3>
          {editMode ? (
            <textarea
              className="profile-bio"
              value={profileData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          ) : (
            <p className="profile-bio">{profileData.bio}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default IGProfile;
