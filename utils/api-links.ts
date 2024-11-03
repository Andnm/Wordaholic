export const urlServerSide = "https://wordaholic-vosv.onrender.com";

const apiLinks = {
  customer: {
    loginWithCustomerEmail: `${urlServerSide}/api/auth/login`,
    loginWithGoogle: `${urlServerSide}/api/auth/loginGoogle`,
    getProfile: `${urlServerSide}/api/users/current`,
    getUserById: `${urlServerSide}/api/users`,
  },
  room: {
    createRoom: `${urlServerSide}/api/rooms/create-room`,
    joinRoom: `${urlServerSide}/api/rooms/join-room`,
    leaveRoom: `${urlServerSide}/api/rooms/leave-room`,
    kickPlayer: `${urlServerSide}/api/rooms/kick-player`,
    changeReadyStatus: `${urlServerSide}/api/rooms/change-ready-status`,
    startGame: `${urlServerSide}/api/rooms/start-game`,
    playTurnWithPlayer: `${urlServerSide}/api/rooms/play-turn-with-player`,
    startWithBot: `${urlServerSide}/api/rooms/start-with-bot`,
    playTurnWithBot: `${urlServerSide}/api/rooms/play-turn-with-bot`,
  },
  transaction: {
    createPayOsUrl: `${urlServerSide}/api/transactions/payOs-url`,
  },
  tool: {
    getAllTool: `${urlServerSide}/api/tools`,
    useHint: `${urlServerSide}/api/tools/use-hint`,
    buyItem:  `${urlServerSide}/api/tools`,
    buyStamina:  `${urlServerSide}/api/tools/stamina`,
  },
};

export default apiLinks;
