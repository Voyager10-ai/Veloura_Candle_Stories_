import './AnnouncementBar.css';

const AnnouncementBar = () => {
  const announcements = [
    { text: 'Use Code ', highlight: 'VELOURA10', postText: ' for 10% OFF' },
    { text: '100% Hand-Poured Soy Wax' },
    { text: 'Explore our Signature Blends Collection' },
    { text: 'Contact Us for Custom Corporate Gifting' }
  ];

  // Repeat items multiple times for seamless, jitter-free scrolling loop
  const items = [...announcements, ...announcements, ...announcements];

  return (
    <div className="announcement-bar">
      <div className="announcement-bar__ticker">
        <div className="announcement-bar__track">
          {items.map((item, index) => (
            <div key={index} className="announcement-bar__item">
              <span className="announcement-bar__text">
                {item.text}
                {item.highlight && <strong>{item.highlight}</strong>}
                {item.postText}
              </span>
              <span className="announcement-bar__dot">•</span>
            </div>
          ))}
        </div>
      </div>
      <a href="#contact" className="announcement-bar__help">
        Need Help?
      </a>
    </div>
  );
};

export default AnnouncementBar;
