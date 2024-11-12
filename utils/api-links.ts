export const urlServerSide = "https://wordaholic-vosv.onrender.com";

const apiLinks = {
  customer: {
    loginWithCustomerEmail: `${urlServerSide}/api/auth/login`,
    loginWithGoogle: `${urlServerSide}/api/auth/loginGoogle`,
    getProfile: `${urlServerSide}/api/users/current`,
    getUserById: `${urlServerSide}/api/users`,
    register: `${urlServerSide}/api/auth/register`,
  },
  room: {
    getAllRoom: `${urlServerSide}/api/rooms`,
    getRoomById: `${urlServerSide}/api/rooms`,
    createRoom: `${urlServerSide}/api/rooms/create-room`,
    joinRoom: `${urlServerSide}/api/rooms/join-room`,
    joinRoomWithCode: `${urlServerSide}/api/rooms/join-room-with-code`,
    leaveRoom: `${urlServerSide}/api/rooms/leave-room`,
    kickPlayer: `${urlServerSide}/api/rooms/kick-player`,
    changeReadyStatus: `${urlServerSide}/api/rooms/change-ready-status`,
    startGame: `${urlServerSide}/api/rooms/start-game`,
    playTurnWithPlayer: `${urlServerSide}/api/rooms/play-turn-with-player`,
    startWithBot: `${urlServerSide}/api/rooms/start-with-bot`,
    playTurnWithBot: `${urlServerSide}/api/rooms/play-turn-with-bot`,
    removePlayerFromMatch: `${urlServerSide}/api/rooms/remove-player-from-match`,
    checkUserInRoom: `${urlServerSide}/api/rooms/check-user-in-room`,
  },
  transaction: {
    createPayOsUrl: `${urlServerSide}/api/transactions/payOs-url`,
  },
  tool: {
    getAllTool: `${urlServerSide}/api/tools`,
    useHint: `${urlServerSide}/api/tools/use-hint`,
    buyItem: `${urlServerSide}/api/tools`,
    buyStamina: `${urlServerSide}/api/tools/stamina`,
  },
  statistics: {
    statisticSale: `${urlServerSide}/api/transactions/admin/statistic-sales`,
    revenueMonthly: `${urlServerSide}/api/transactions/admin/statistic-revenue-monthly`,
    revenueCurrentWeek: `${urlServerSide}/api/transactions/admin/statistic-revenue-current-week`,
  },
};

export default apiLinks;
