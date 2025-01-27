import baseComponent from '../helpers/baseComponent'
import classNames from '../helpers/classNames'
import styleToCssString from '../helpers/styleToCssString'
import { getSystemInfo } from '../helpers/checkIPhoneX'

const findActiveByIndex = (current, currentName, sections) => {
    return sections.filter((section) => (
        section.index === current &&
            section.name === currentName
    ))[0]
}
  
const findActiveByPosition = (scrollTop, offsetY, sections) => {
    return sections.filter((section) => (
        scrollTop < (section.top + section.height - offsetY) &&
            scrollTop >= (section.top - offsetY)
    ))[0]
}

baseComponent({
    relations: {
        '../index-item/index': {
            type: 'child',
            observer() {
                this.callDebounceFn(this.updated)
            },
        },
    },
    properties: {
        prefixCls: {
            type: String,
            value: 'wux-index',
        },
        height: {
            type: [String, Number],
            value: 300,
            observer: 'updateStyle',
        },
        showIndicator: {
            type: Boolean,
            value: true,
        },
        parentOffsetTop: {
            type: Number,
            value: 0,
        },
    },
    data: {
        scrollTop: 0,
        sections: [],
        moving: false,
        current: 0,
        currentName: '',
        extStyle: '',
    },
    computed: {
        classes: ['prefixCls', function(prefixCls) {
            const wrap = classNames(prefixCls)
            const nav = `${prefixCls}__nav`
            const navRow = `${prefixCls}__nav-row`
            const navItem = `${prefixCls}__nav-item`
            const indicator = `${prefixCls}__indicator`

            return {
                wrap,
                nav,
                navRow,
                navItem,
                indicator,
            }
        }],
    },
    methods: {
        /**
         * 更新样式
         */
        updateStyle(height = this.data.height) {
            const extStyle = styleToCssString({ height })

            if (extStyle !== this.data.extStyle) {
                this.setData({
                    extStyle,
                })
            }
        },
        /**
         * 更新元素
         */
    	updated() {
            const elements = this.getRelationNodes('../index-item/index')

            if (elements.length > 0) {
                elements.forEach((element, index) => {
                    element.updated(index)
                })

                // HACK: https://github.com/wux-weapp/wux-weapp/issues/224
                setTimeout(this.getNavPoints.bind(this))
            }

            if (this.data.sections.length !== elements.length) {
                this.setData({
                    sections: elements.map((element) => element.data),
                })
            }
        },
        /**
         * 设置当前激活的元素
         */
        setActive(current, currentName) {
            if (current !== this.data.current || currentName !== this.data.currentName) {
                const target = findActiveByIndex(current, currentName, this.data.sections)
                if (target !== undefined) {
                    this.setData({
                        current,
                        currentName,
                        scrollTop: target.top - this.data.parentOffsetTop,
                    })
                }

                // 振动反馈
                this.vibrateShort()
                this.triggerEvent('change', { index: current, name: currentName })
            }
        },
        /**
         * 手指触摸动作开始
         */
        onTouchStart(e) {
            if (this.data.moving) return
            const { index, name } = e.target.dataset
            this.setActive(index, name)
            this.setData({ moving: true })
        },
        /**
         * 手指触摸后移动
         */
        onTouchMove(e) {
            const target = this.getTargetFromPoint(e.changedTouches[0].pageY)

            if (target !== undefined) {
                const { index, name } = target.dataset
                this.setActive(index, name)
            }
        },
        /**
         * 手指触摸动作结束
         */
        onTouchEnd(e) {
            if (!this.data.moving) return
            setTimeout(() => this.setData({ moving: false }), 300)
        },
        /**
         * 滚动事件的回调函数
         */
        onScroll(e) {
            if (this.data.moving) return

            if (!this.checkActiveIndex) {
                const { run: checkActiveIndex } = this.useThrottleFn((data, event) => {
                    const target = findActiveByPosition(event.detail.scrollTop, data.parentOffsetTop, data.sections)
                    if (target !== undefined) {
                        const current = target.index
                        const currentName = target.name
                        if (current !== data.current || currentName !== data.currentName) {
                            this.setData({
                                current,
                                currentName,
                            })
                            this.triggerEvent('change', { index: current, name: currentName })
                        }
                    }
                }, 50, { trailing: true, leading: true })
                this.checkActiveIndex = checkActiveIndex
            }

            this.checkActiveIndex.call(this, this.data, e)
        },
        /**
         * 获取右侧导航对应的坐标
         */
        getNavPoints() {
            const className = `.${this.data.prefixCls}__nav-item`
            wx
                .createSelectorQuery()
                .in(this)
                .selectAll(className)
                .boundingClientRect((rects) => {
                    if (rects.filter((n) => !n).length) return
                    this.setData({
                        points: rects.map((n) => ({ ...n, offsets: [n.top, n.top + n.height] })),
                    })
                })
                .exec()
        },
        /**
         * 根据坐标获得对应的元素
         */
        getTargetFromPoint(y) {
            const { points } = this.data
            let target

            for (let i = points.length - 1; i >= 0; i--) {
                const [a, b] = points[i].offsets

                // 1.判断是否为第一个元素且大于最大坐标点
                // 2.判断是否为最后一个元素且小于最小坐标点
                // 3.判断是否包含于某个坐标系内
                if ((i === points.length - 1 && y > b) || (i === 0 && y < a) || (y >= a && y <= b)) {
                    target = points[i]
                    break
                }
            }

            return target
        },
    },
    created() {
        const systemInfo = getSystemInfo()
        this.vibrateShort = () => {
            if (systemInfo.platform !== 'devtools') {
                wx.vibrateShort()
            }
        }
    },
    ready() {
        this.updateStyle()
        this.getNavPoints()
    },
})
