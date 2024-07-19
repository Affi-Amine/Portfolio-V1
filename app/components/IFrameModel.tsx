import { Canvas } from '@react-three/fiber';

function IframeModel({ url }: { url: string }) {
  return (
    <Canvas>
      <iframe
        src={url}
        width="100%"
        height="100%"
        allowFullScreen
      />
    </Canvas>
  );
}

export default IframeModel