import React, { useState, useEffect } from 'react';
import merhaHeroImg from '../assets/images/merha_hero_landscape_1791458712697.jpg';
import kurarBridgeImg from '../assets/images/kurar_river_bridge_1791458725776.jpg';
import katoriaHillsImg from '../assets/images/katoria_hills_forest_1791458736547.jpg';
import villageFieldsImg from '../assets/images/village_fields_farming_1791458747662.jpg';
import villageTempleImg from '../assets/images/village_temple_culture_1791458758312.jpg';
import villageSchoolImg from '../assets/images/village_school_education_1791458769892.jpg';

const BUILTIN_IMAGES: Record<string, string> = {
  'merha_hero_landscape_1791458712697.jpg': merhaHeroImg,
  'kurar_river_bridge_1791458725776.jpg': kurarBridgeImg,
  'katoria_hills_forest_1791458736547.jpg': katoriaHillsImg,
  'village_fields_farming_1791458747662.jpg': villageFieldsImg,
  'village_temple_culture_1791458758312.jpg': villageTempleImg,
  'village_school_education_1791458769892.jpg': villageSchoolImg,
};

export function resolveVillageImageUrl(rawSrc?: string): string {
  if (!rawSrc || !rawSrc.trim()) {
    return merhaHeroImg;
  }
  const trimmed = rawSrc.trim();
  for (const [filename, bundledUrl] of Object.entries(BUILTIN_IMAGES)) {
    if (trimmed.includes(filename)) {
      return bundledUrl;
    }
  }
  if (trimmed.startsWith('/src/assets/images/')) {
    return trimmed.replace('/src/assets/images/', '/images/');
  }
  return trimmed;
}

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
  containerClassName?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackLabel,
  containerClassName = '',
  className = '',
  ...props
}) => {
  const resolvedSrc = resolveVillageImageUrl(src);
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);

  useEffect(() => {
    setCurrentSrc(resolveVillageImageUrl(src));
  }, [src]);

  return (
    <img
      src={currentSrc || merhaHeroImg}
      alt={alt || fallbackLabel || 'Merha Village'}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => {
        if (currentSrc !== merhaHeroImg) {
          setCurrentSrc(merhaHeroImg);
        } else if (currentSrc !== '/Gemini_Generated_Image_4k9nnx4k9nnx4k9n.png') {
          setCurrentSrc('/Gemini_Generated_Image_4k9nnx4k9nnx4k9n.png');
        }
      }}
      className={className}
      {...props}
    />
  );
};
