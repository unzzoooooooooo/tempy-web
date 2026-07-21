export const calculatePointerRepel = ({
  rect,
  pointerX,
  pointerY,
  influenceRadius,
  maxX,
  maxY = maxX,
  strengthPower = 1.8,
}) => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = centerX - pointerX;
  const dy = centerY - pointerY;
  const distance = Math.hypot(dx, dy);

  if (distance >= influenceRadius) {
    return { x: 0, y: 0, isActive: false };
  }

  const strength = (1 - distance / influenceRadius) ** strengthPower;
  const safeDistance = Math.max(distance, 1);

  return {
    x: (dx / safeDistance) * maxX * strength,
    y: (dy / safeDistance) * maxY * strength,
    isActive: true,
  };
};
