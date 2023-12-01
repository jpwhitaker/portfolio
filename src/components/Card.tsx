import { useState, useRef, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import styles from './HoverCard.module.css';

const HoverCard = ({ i }: { i: number; }) => {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [zIndex, setZIndex] = useState('z-[0]');

  const colors = [
    'bg-red-400',
    'bg-blue-400',
    'bg-green-400',
    'bg-purple-400',
    'bg-orange-400',
    'bg-pink-400',
    'bg-yellow-400',
    '',
  ];

  const containerStyle = ` ${isMaximized ? 'fixed inset-0' : ' aspect-[16/9]'} ${zIndex}`;
  const motionDivStyle = isMaximized ? 'h-screen w-screen' : 'h-full';

  return (
    <div className="aspect-[16/9]">
      <div className={`${colors[i]} h-full text-white h-full w-full rounded-[8px] p-4`}>hi</div>
    </div>
  );
};

export default HoverCard;
