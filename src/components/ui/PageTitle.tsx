// React 19 moves <title> into <head> automatically
export default function PageTitle({ title }: { title: string }) {
  return <title>{`${title} | MentorLagbe`}</title>;
}
