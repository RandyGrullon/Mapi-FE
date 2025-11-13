interface RoomTypeProps {
  roomType: string;
}

export const RoomType = ({ roomType }: RoomTypeProps) => (
  <div className="bg-white rounded-lg p-4 mb-4">
    <h4 className="font-bold mb-2">Tipo de Habitación</h4>
    <p className="text-gray-700">{roomType}</p>
  </div>
);
