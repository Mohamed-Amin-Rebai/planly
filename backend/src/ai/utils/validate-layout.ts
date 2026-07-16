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

  // validate rooms
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

  // validate doors
  if (!Array.isArray(layout.doors)) {
    return false;
  }

  if (layout.doors.length === 0) {
    return false;
  }

  const mainDoors = layout.doors.filter(
    (d: any) => d.type === "main",
  );

  if (mainDoors.length !== 1) {
    return false;
  }

  for (const door of layout.doors) {
    if (!door.type) {
      return false;
    }

    if (!door.room) {
      return false;
    }

    if (!door.wall) {
      return false;
    }

    if (
      !["north", "south", "east", "west"].includes(
        door.wall,
      )
    ) {
      return false;
    }
  }

  const roomNames = layout.rooms.map(
    (r: any) => r.name,
  );

  for (const door of layout.doors) {
    if (!roomNames.includes(door.room)) {
      return false;
    }
  }

  // validate windowns
  if (!Array.isArray(layout.windows)) {
    return false;
  }

  for (const window of layout.windows) {
    if (!window.room) {
      return false;
    }

    if (!window.wall) {
      return false;
    }
  }

  // Validate required windows
  for (const room of layout.rooms) {
    const roomWindows =
      layout.windows.filter(
        (w: any) => w.room === room.name,
      );

    switch (room.name.toLowerCase()) {
      case "bedroom":
        if (roomWindows.length < 1) {
          return false;
        }
        break;

      case "kitchen":
        if (roomWindows.length < 1) {
          return false;
        }
        break;

      case "living room":
        if (roomWindows.length < 1) {
          return false;
        }
        break;

      case "hallway":
        if (room.width < 1) return false;
        if (room.height < 1) return false;
        break;
    }
  }

  return true;
}