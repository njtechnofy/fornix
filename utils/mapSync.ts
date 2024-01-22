import * as FileSystem from "expo-file-system";
import { Region } from "react-native-maps";

type Tile = {
  x: number;
  y: number;
  z: number;
};

export function tileGridForRegion(
  region: Region,
  minZoom: number,
  maxZoom: number
) {
  let tiles: Tile[] = [];

  for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
    const subTiles = tilesForZoom(region, zoom);
    tiles = [...tiles, ...subTiles];
  }

  return tiles;
}

function tilesForZoom(region: Region, zoom: number) {
  const minLon = region.longitude - region.longitudeDelta;
  const minLat = region.latitude - region.latitudeDelta;
  const maxLon = region.longitude + region.longitudeDelta;
  const maxLat = region.latitude + region.latitudeDelta;

  let minTileX = lonToTileX(minLon, zoom);
  let maxTileX = lonToTileX(maxLon, zoom);
  let minTileY = latToTileY(maxLat, zoom);
  let maxTileY = latToTileY(minLat, zoom);

  let tiles = [];

  for (let x = minTileX; x <= maxTileX; x++) {
    for (let y = minTileY; y <= maxTileY; y++) {
      tiles.push({ x, y, z: zoom });
    }
  }

  return tiles;
}

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function lonToTileX(lon: number, zoom: number) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function latToTileY(lat: number, zoom: number) {
  return Math.floor(
    ((1 -
      Math.log(Math.tan(degToRad(lat)) + 1 / Math.cos(degToRad(lat))) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
}

export async function fetchTiles(
  tileGrid: Tile[],
  rootFolder: string,
  tileServerUrl: string
) {
  const create_directories = tileGrid.map((tile) => {
    const folder = `${rootFolder}/${tile.z}/${tile.x}`;
    return FileSystem.makeDirectoryAsync(folder, {
      intermediates: true,
    });
  });
  await Promise.all(create_directories);

  const tile_downloads = tileGrid.map((tile) => {
    const fetchUrl = `${tileServerUrl}/${tile.z}/${tile.x}/${tile.y}.png`;
    const fsLocation = `${rootFolder}/${tile.z}/${tile.x}/${tile.y}.png`;

    return FileSystem.downloadAsync(fetchUrl, fsLocation);
  });

  const fileStatuses = await Promise.all(tile_downloads);


    fileStatuses.forEach(file => {
      console.log('Downloaded, file.uri)
    })
    
}
