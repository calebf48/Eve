import React, { useState } from 'react';
import Webcam from 'react-webcam';
import '../App.css';

function Registration() {
  const [name, setName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [feedback, setFeedback] = useState('');

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  }, [webcamRef]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);

    // Convert base64 image to file-like object
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        formData.append('file', file);

        // Adjust URL to your Flask endpoint
        fetch('http://localhost:5000/register', {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            setFeedback(data.message);
          })
          .catch((error) => {
            console.error('Error:', error);
            setFeedback("An error occurred.");
          });
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Select Option</p>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ margin: "auto", textAlign: "center" }}
        />
        <button onClick={capture}>Capture photo</button>
        {imageSrc && (
          <>
            <img src={imageSrc} alt="Captured" style={{ margin: "auto", textAlign: "center" }}/>
            <form onSubmit={handleSubmit}>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" required/>
              <button type="submit">Submit</button>
            </form>
          </>
        )}
        {feedback && <p>{feedback}</p>}
      </header>
    </div>
  );
}

export default Registration;