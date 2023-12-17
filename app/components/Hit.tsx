import { Text, Anchor, Badge, Group, AspectRatio } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';

type AlgoliaHit<T> = {
  objectID: string;
} & T;

type Artist = {
  name: string;
  reading_name: string;
  reading_name_hiragana: string;
  karaoke_type: string;
  url: string;
};

type OriginalSong = {
  title: string;
  original: {
    title: string;
    short_title: string;
  };
  categories: {
    lvl0: string;
    lvl1: string;
    lvl2: string;
  };
};

type KaraokeDeliveryModel = {
  name: string;
  karaoke_type: string;
};

type Circle = {
  name: string;
};

type Video = {
  type: string;
  url: string;
  id: string;
};

type TouhouMusic = {
  type: string;
  url: string;
};

type SongData = {
  title: string;
  reading_title: string;
  display_artist: Artist;
  original_songs: OriginalSong[];
  karaoke_type: string;
  karaoke_delivery_models: KaraokeDeliveryModel[];
  circle: Circle;
  url: string;
  updated_at_i: number;
  song_number?: string;
  videos: Video[];
  touhou_music: TouhouMusic[];
  delivery_deadline_date?: string;
  musicpost_url?: string;
};

type HitProps = {
  hit: AlgoliaHit<SongData>;
};

type DisplayCircleProps = {
  circle: Circle;
}

type DisplayArtistProps = {
  artist: Artist;
}

type DisplayOriginalSongsProps = {
  songs: OriginalSong[];
};

type DisplayKaraokeDeliveryModelsProps = {
  karaokeDeliveryModels: KaraokeDeliveryModel[];
}

type DisplayVideosProps = {
  videos: Video[];
}

export function Hit({ hit }: HitProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <DisplayTitle hit={hit} />
      <DisplaySongNumber hit={hit} />
      <DisplayDeliveryDeadlineDate hit={hit} />
      <DisplayCircle circle={hit.circle} />
      <DisplayArtist artist={hit.display_artist} />
      <DisplayOriginalSongs songs={hit.original_songs} />
      <DisplayKaraokeDeliveryModels karaokeDeliveryModels={hit.karaoke_delivery_models} />
      <DisplayVideos videos={hit.videos} />
    </div>
  );
}

export function DisplayTitle({ hit }: HitProps) {
  return (
    <div className="flex justify-between items-end">
      <Text fw={700} size="xl">{hit.title}</Text>
      <Anchor href={hit.url} target="_blank" underline="never">
        <IconExternalLink size={16} color={'black'} />
      </Anchor>
    </div>
  );
}

export function DisplaySongNumber({ hit }: HitProps) {
  return (
    <div className="flex justify-between items-end">
      <Text fw={700}>曲番号:</Text>
      <Text className="pl-8">{hit.song_number === undefined ? "なし" : hit.song_number}</Text>
    </div>
  );
}

export function DisplayDeliveryDeadlineDate({ hit }: HitProps) {
  if (hit.delivery_deadline_date === undefined) {
    return null;
  }

  return (
    <div className="flex justify-between items-end">
      <Text fw={700}>配信期限:</Text>
      <Text className="pl-8">{hit.delivery_deadline_date}</Text>
    </div>
  );
}

export function DisplayCircle({ circle }: DisplayCircleProps) {
  return (
    <div className="flex justify-between items-end">
      <Text fw={700}>サークル名:</Text>
      <Text className="pl-8">{circle.name}</Text>
    </div>
  );
}

export function DisplayArtist({ artist }: DisplayArtistProps) {
  return (
    <div className="flex justify-between items-end">
      <Text fw={700}>歌手名:</Text>
      <Text className="pl-8">{artist.name}({artist.reading_name})</Text>
      <Anchor href={artist.url} target="_blank" underline="never">
        <IconExternalLink size={16} color={'black'} />
      </Anchor>
    </div>
  );
}

export function DisplayOriginalSongs({ songs }: DisplayOriginalSongsProps) {
  return (
    <>
      <Text fw={700}>原曲(原作):</Text>
      {songs.map((song, index) => (
        <Text key={`${song.title}-${index}`}>{song.title}({song.original.short_title})</Text>
      ))}
    </>
  );
}

export function DisplayKaraokeDeliveryModels({ karaokeDeliveryModels }: DisplayKaraokeDeliveryModelsProps) {
  return (
    <>
      <Text fw={700}>配信機種:</Text>
      <Group>
        {karaokeDeliveryModels.map((karaokeDeliveryModel) => {
          let badge;
          switch (karaokeDeliveryModel.karaoke_type) {
            case "DAM":
              badge = <Badge color="rgba(0, 0, 0, 1)" radius="sm">{karaokeDeliveryModel.name}</Badge>;
              break;
            case "JOYSOUND":
              badge = <Badge color="red" radius="sm">{karaokeDeliveryModel.name}</Badge>;
              break;
            default:
              badge = <Badge radius="sm">{karaokeDeliveryModel.name}</Badge>; // default styling for other karaoke types
          }
          return <div key={karaokeDeliveryModel.name}>{badge}</div>;
        })}
      </Group>
    </>
  );
}

export function DisplayVideos({ videos }: DisplayVideosProps ) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <>
      <Text fw={700}>動画:</Text>
      {videos.map(video => (
        // 各要素に `key` プロパティとして `video.id` を使用します。
        <div key={video.id}>
          {renderVideo(video)}
        </div>
      ))}
    </>
  );
}

function renderVideo(video: Video) {
  const commonIframeProps = {
    allow: "autoplay; encrypted-media",
    allowFullScreen: true,
    style: {}, // 共通のスタイルがあればここに追加
  };

  switch (video.type) {
    case "YouTube":
      return (
        <AspectRatio ratio={16 / 9}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}`}
            {...commonIframeProps}
          />
        </AspectRatio>
      );
    case "ニコニコ動画":
      return (
        <AspectRatio ratio={16 / 9}>
          <iframe
            src={`https://embed.nicovideo.jp/watch/${video.id}?oldScript=1&referer=&from=0&allowProgrammaticFullScreen=1`}
            {...commonIframeProps}
          />
        </AspectRatio>
      );
    default:
      return <Text>{video.url}</Text>;
  }
}
