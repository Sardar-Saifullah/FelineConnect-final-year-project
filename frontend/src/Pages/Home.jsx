import Row1 from "../components/Home/Row1";
import Deal from "../components/Home/Deal";
// import "react-chatbotify/build/main.css";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import Services from "../components/common/components/Services";
import AllProducts from "../components/Home/AllProducts";
import { useProducts } from "../actions/query";
import { useEffect, useState, useRef } from "react";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { ChatBubble, PlusOne, PlusOneOutlined } from "@mui/icons-material";

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyCYYkrtPDmNKPGoNpOrbhK56JLZnYQjtys";

async function runChat(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  console.log(response.text());
  return response.text();
}

function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [resultData, setResultData] = useState("");
  const messagesEndRef = useRef(null);

  const callGeminiAPI = async () => {
    if (!input) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await runChat(input);
      let formattedResponse = response
        .split("**")
        .map((part, index) => (index % 2 === 1 ? `<b>${part}</b>` : part))
        .join("")
        .split("*")
        .join("<br/>");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: formattedResponse },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error with Gemini API. Please try again.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };
  const onSubmitAction = () => {
    if (!input) return;
    callGeminiAPI();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="relative w-[400px] bg-gray-800 flex justify-center h-[70vh] overflow-auto">
      {/* <div className="relative w-[400px] h-full"> */}
      <div className="w-full mx-auto h-full overflow-auto pb-32 pt-4">
        {messages.map((msg, i) => (
          <div
            ref={i === messages.length - 1 ? messagesEndRef : null}
            key={i}
            className={`m-3 p-3 max-w-[75%] rounded-lg text-white my-2 ${
              msg.role === "assistant" ? "bg-gray-700 ml-auto" : "bg-blue-600"
            }`}
          >
            <div dangerouslySetInnerHTML={{ __html: msg.content }} />
          </div>
        ))}
        {isThinking && (
          <div className="p-3 max-w-full text-white my-2 ml-auto">
            <svg
              className="inline w-8 h-8 animate-spin mr-2 fill-blue-600"
              viewBox="0 0 100 101"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="text-white opacity-70">Loading...</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 bg-gray-900 flex items-center w-full px-2 py-7">
        <input
          placeholder="Send a chat"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 rounded-lg mr-2 bg-gray-800 text-white placeholder-gray-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmitAction();
            }
          }}
        />
      </div>
      {/* </div> */}
      {!messages.length && (
        <div className="absolute top-[20vh] text-center">
          <h1 className="font-bold text-4xl text-white">ChatBot</h1>
          <p className="text-white mt-2">
            Hello there! I'm Chatbot, a language model trained to assist you
            with various topics and questions. What can I help you with today?
            Feel free to type your query or topic of interest, and I'll do my
            best to provide you with helpful and informative responses.
          </p>
        </div>
      )}
    </div>
  );
}
const Home = () => {
  const limit = 10;
  const [page, setPage] = useState(1); // Control the page manually
  const {
    data,
    error,
    isLoading: loading,
    isFetching,
    isPreviousData,
  } = useProducts(page, limit); // Fetch products based on page and limit
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // Keep track of total pages
  const [productsData, setProductsData] = useState([]);
  const [openChatBot, setOpenChatBot] = useState(false);

  // Update the products and pagination details when data changes
  useEffect(() => {
    if (data) {
      setTotalProducts(data?.totalProducts || 0);
      setProductsData(data?.products || []);
      setTotalPages(data?.totalPages || 0); // Set total pages from API response
    }
  }, [data]);

  return (
    <div dir="ltr" className="flex flex-col xl:mx-32 mt-28 gap-3 relative">
      <Row1 />
      <AllProducts items={productsData} />
      <Services />
      <Deal />
      <div className="max-md:hidden">
        <div
          onClick={() => {
            setOpenChatBot(!openChatBot);
          }}
          className="p-4 fixed bottom-[60px] right-[30px] rounded-full bg-white border-[1px] shadow-md cursor-pointer"
        >
          <ChatBubble />
        </div>
        <div className=" fixed bottom-[60px] right-[100px]">
          {openChatBot && (
            <div className="relative">
              <ChatBot />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
