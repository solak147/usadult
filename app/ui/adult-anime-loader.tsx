import { getFeaturedAdultAnime } from "@/lib/reya-h";
import AdultAnimeSection from "./adult-anime-section";

export default async function AdultAnimeLoader() {
  const titles = await getFeaturedAdultAnime();
  return <AdultAnimeSection titles={titles} />;
}
