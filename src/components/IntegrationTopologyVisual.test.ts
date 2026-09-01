import { render } from '@testing-library/vue'

import IntegrationTopologyVisual from './IntegrationTopologyVisual.vue'

function renderTopology() {
  return render(IntegrationTopologyVisual, {
    props: { label: 'DrillMind 开放集成拓扑动画' },
  }).container
}

function linkTargets(container: HTMLElement, bus: string) {
  return Array.from(
    container.querySelectorAll(`[data-topology-link][data-source-bus="${bus}"]`),
    (link) => link.getAttribute('data-target-id'),
  )
}

describe('开放集成拓扑动画', () => {
  it('展示 DrillMind 的完整平台外壳', () => {
    const container = renderTopology()

    expect(container.querySelector('[data-platform-shell="true"]')).toHaveTextContent('DrillMind')
    expect(container.querySelector('[data-platform-chrome="shared"]')).toBeInTheDocument()
    expect(container.querySelector('[data-platform-body="true"]')).toHaveAttribute(
      'transform',
      'translate(0 -16)',
    )
    expect(
      container.querySelector('[data-platform-body="true"] > rect[fill="#23283a"]'),
    ).toHaveAttribute('height', '444')
    expect(container.querySelector('[data-platform-region="main-menu"]')).toHaveTextContent(
      '保存工程',
    )
    expect(container.querySelector('[data-platform-region="device-tab"]')).toHaveTextContent('设备')
    expect(container.querySelector('[data-platform-region="toolbar"]')).toHaveTextContent(
      '删除放大缩小适应',
    )
    expect(container.querySelector('[data-platform-region="statusbar"]')).toHaveTextContent(
      '本地配置已连接',
    )
  })

  it('严格区分 CAN1、CAN2 与 TCP 的连接目标', () => {
    const container = renderTopology()

    expect(linkTargets(container, 'can1')).toEqual([
      'can-dptp',
      'can-drill-arm1',
      'can-power',
      'extension-can1',
    ])
    expect(linkTargets(container, 'can2')).toEqual(['extension-can2'])
    expect(linkTargets(container, 'tcp')).toEqual([
      'tcp-empty',
      'tcp-sim',
      'extension-tcp',
    ])
  })

  it('CAN1 与 CAN2 使用互不交叉的独立走线', () => {
    const container = renderTopology()
    const can1Paths = Array.from(
      container.querySelectorAll('[data-topology-link][data-source-bus="can1"]'),
      (link) => link.getAttribute('d'),
    )
    const can2Path = container
      .querySelector('[data-topology-link][data-source-bus="can2"]')
      ?.getAttribute('d')

    expect(can1Paths).toHaveLength(4)
    expect(can1Paths.every((path) => path?.startsWith('M 418 284') && path.endsWith('H 468'))).toBe(
      true,
    )
    expect(can2Path).toBe('M 350 284 V 386 H 282')
  })

  it('显示精确驱动名称，并保持 Plan 和 Lidar 浮空无连线', () => {
    const container = renderTopology()
    const driverLabels = Array.from(
      container.querySelectorAll('[data-topology-node="driver"]'),
      (node) => node.getAttribute('data-node-label'),
    )
    const floatingNodes = container.querySelectorAll(
      '[data-topology-node="driver"][data-connected="false"]',
    )
    const allTargets = Array.from(
      container.querySelectorAll('[data-topology-link]'),
      (link) => link.getAttribute('data-target-id'),
    )

    expect(driverLabels).toEqual([
      'DRV-CanOpen-DPTP',
      'DRV-CanOpen-DrillArm1',
      'DRV-CanOpen-Power',
      'DRV-CanOpen-SIM',
      'DRV-Drill-Plan',
      'DRV-Lidar-Drill',
    ])
    expect(floatingNodes).toHaveLength(2)
    expect(allTargets).not.toContain('floating-plan')
    expect(allTargets).not.toContain('floating-lidar')
    expect(container.querySelector('[data-node-id="tcp-empty"]')).toHaveTextContent('Empty')
  })

  it('保留应用、CAN1、CAN2 和 TCP 四个扩展位置', () => {
    const container = renderTopology()

    expect(
      Array.from(container.querySelectorAll('[data-topology-extension="true"]'), (slot) =>
        slot.getAttribute('data-extension-id'),
      ),
    ).toEqual(['application', 'can2', 'can1', 'tcp'])
  })
})
