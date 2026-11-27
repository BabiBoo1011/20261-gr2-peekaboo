import { Suspense, useLayoutEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Grid, OrbitControls, useGLTF } from '@react-three/drei'
import { Box3, MathUtils, Sphere, Vector3 } from 'three'

// Hướng nhìn mặc định: chéo từ phía trước (+Z), hơi cao — giống ảnh xem trước
const VIEW = new Vector3(0.6, 0.45, 1).normalize()

function Model({ url }) {
  const { scene } = useGLTF(url)
  const camera = useThree((state) => state.camera)
  const controls = useThree((state) => state.controls)

  // Đặt camera sao cho cả vật nằm gọn trong khung
  useLayoutEffect(() => {
    const sphere = new Box3().setFromObject(scene).getBoundingSphere(new Sphere())
    const distance = (sphere.radius / Math.sin(MathUtils.degToRad(camera.fov / 2))) * 1.3
    camera.position.copy(sphere.center).addScaledVector(VIEW, distance)
    camera.near = distance / 100
    camera.far = distance * 100
    camera.updateProjectionMatrix()
    if (controls) {
      controls.target.copy(sphere.center)
      controls.update()
    } else {
      camera.lookAt(sphere.center)
    }
  }, [scene, camera, controls])

  return <primitive object={scene} />
}

// Hiển thị một mô hình .glb: kéo chuột để xoay, cuộn để phóng to
export default function ModelViewer({ url }) {
  return (
    <Canvas camera={{ position: [1.2, 1, 2], fov: 40 }}>
      <color attach="background" args={['#f3f2ee']} />
      <hemisphereLight args={['#ffffff', '#9a9a9a', 2.2]} />
      <directionalLight position={[2, 4, 3]} intensity={2} />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <Grid infiniteGrid cellSize={0.1} sectionSize={1} fadeDistance={20} cellColor="#d6d3cb" sectionColor="#b9b5aa" />
      <OrbitControls makeDefault />
    </Canvas>
  )
}
