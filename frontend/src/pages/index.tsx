import dynamic from 'next/dynamic'

const TitleScene = dynamic(() => import('../components/threejs/scenes/TitleScene'), {
  ssr: false,
})

export default function Index() {
  return (
    <div className="overflow-x-hidden">
      <TitleScene />
    </div>
  );
}
