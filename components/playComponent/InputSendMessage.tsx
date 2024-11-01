import { toastError } from "@utils/global";
import React, { useEffect, useState } from "react";
import { FaPaperPlane, FaMicrophone } from "react-icons/fa";

interface Props {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  placeholder?: string;
}

const InputSendMessage: React.FC<Props> = (props) => {
  const { message, setMessage, handleSendMessage, placeholder } = props;
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        if (event.results && event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript.trim());
        } else {
          console.warn("No results found.");
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setSpeechRecognition(recognition);
    } else {
      console.warn("Speech recognition not supported");
    }
  }, []);

  const handleSpeechRecognition = () => {
    if (speechRecognition) {
      if (isListening) {
        speechRecognition.stop();
      } else {
        try {
          speechRecognition.start();
        } catch (error) {
          console.error("Error starting speech recognition:", error);
        }
      }
    } else {
      toastError("Your browser does not support voice recognition!");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  return (
    <div className="message-input-container w-11/12 flex items-center gap-2">
      <button
        onClick={handleSpeechRecognition}
        className={`voice-button hover:shadow-lg bg-white ${
          isListening ? "shadow-lg" : ""
        }`}
        aria-label="Voice Input"
      >
        <FaMicrophone color={isListening ? "red" : "black"} />
      </button>

      <input
        type="text"
        className="input"
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={handleSendMessage}
        className="send-button"
        disabled={!message.trim()}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default InputSendMessage;
