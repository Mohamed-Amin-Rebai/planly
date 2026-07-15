function overlaps(a: any, b: any): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function getBoundaryLimits(boundary: number[][]) {
  const xs = boundary.map((p) => p[0]);
  const ys = boundary.map((p) => p[1]);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

export function validateLayout(layout: any, boundary: number[][]): boolean {
  if (!layout) return false;

  if (!layout.rooms) return false;

  if (!Array.isArray(layout.rooms)) return false;

  for (const room of layout.rooms) {
    if (!room.name) return false;

    if (typeof room.x !== "number") return false;
    if (typeof room.y !== "number") return false;

    if (typeof room.width !== "number") return false;
    if (typeof room.height !== "number") return false;

    if (room.width <= 0) return false;
    if (room.height <= 0) return false;

    // Minimum room sizes
    switch (room.name.toLowerCase()) {
      case "bedroom":
        if (room.width < 3 || room.height < 3) return false;
        break;

      case "bathroom":
        if (room.width < 2 || room.height < 2) return false;
        break;

      case "kitchen":
        if (room.width < 3 || room.height < 3) return false;
        break;

      case "living room":
        if (room.width < 4 || room.height < 4) return false;
        break;
    }
  }

  // Overlap detection
  for (let i = 0; i < layout.rooms.length; i++) {
    for (let j = i + 1; j < layout.rooms.length; j++) {
      if (overlaps(layout.rooms[i], layout.rooms[j])) {
        return false;
      }
    }
  }

  // boundary validation
  // const bounds = getBoundaryLimits(boundary);

  // for (const room of layout.rooms) {
  //   if (room.x < bounds.minX) {
  //     return false;
  //   }

  //   if (room.y < bounds.minY) {
  //     return false;
  //   }

  //   if (room.x + room.width > bounds.maxX) {
  //     return false;
  //   }

  //   if (room.y + room.height > bounds.maxY) {
  //     return false;
  //   }
  // }

  // no rooms
  if (layout.rooms.length === 0) {
    return false;
  }

  return true;
}