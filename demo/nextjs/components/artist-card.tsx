import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  QueryOutputs,
  useCorsairMutation,
  useCorsairQuery,
} from '@/corsair/client'

interface ArtistCardProps {
  artist: QueryOutputs['get all artists'][number]
  onClick?: (artist: QueryOutputs['get all artists'][number]) => void
}

export function ArtistCard({ artist, onClick }: ArtistCardProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const testMutation = useCorsairMutation('link album to artists')

  testMutation.mutate({
    albumId: '123',
    artistIds: ['456'],
  })

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick?.(artist)}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={(artist.images as unknown as { url: string }[])?.[0]?.url}
            alt={artist.name ?? undefined}
          />
          <AvatarFallback>{artist.name?.charAt(0) ?? ''}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle>{artist.name}</CardTitle>
          {artist.followers && (
            <p className="text-sm text-muted-foreground">
              {formatFollowers(artist.followers)} followers
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {artist.popularity !== undefined && (
            <Badge variant="secondary">Popularity: {artist.popularity}</Badge>
          )}
          {!!artist.genres && (artist.genres as string[]).length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {(artist.genres as string[]).slice(0, 3).map(genre => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
