import React from "react";
import { Modal, Avatar } from "antd";
import { CiTrophy } from "react-icons/ci";
import { generateFallbackAvatar } from "@utils/helpers";
import { PlayerType } from "@models/room";

interface Props {
  leaderboard: string[] | undefined;
  playerList: PlayerType[] | undefined;
  onClose: () => void;
  isVisible: boolean;
}

const LeaderboardModal: React.FC<Props> = (props) => {
  const { isVisible, onClose, leaderboard, playerList } = props;

  const getOrderedPlayers = () => {
    if (!leaderboard || !playerList) return [];

    return leaderboard
      .slice()
      .reverse()
      .map((playerId) => {
        const player = playerList.find((p) => p.user_id._id === playerId);
        return player;
      })
      .filter(Boolean);
  };

  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return "text-yellow-500";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-amber-600";
      default:
        return "text-gray-300";
    }
  };

  const orderedPlayers = getOrderedPlayers();

  return (
    <Modal
      title={
        <div className="text-center text-2xl text-yellow-500">
          Final Results!
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="text-center py-6">
        <div className="space-y-4">
          {orderedPlayers.map((player, index) => (
            <div
              key={player?.user_id._id!}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold ${getMedalColor(index)}`}>
                  #{index + 1}
                </span>
                <Avatar
                  src={
                    player?.user_id.avatar ||
                    generateFallbackAvatar(player?.user_id.email)
                  }
                  alt={player?.user_id.fullname}
                  className="border border-gray-200"
                  size={40}
                />
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {player?.user_id.fullname || player?.user_id.email}
                  </span>
                </div>
              </div>
              {index === 0 && <CiTrophy className="text-3xl text-yellow-500" />}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default LeaderboardModal;
