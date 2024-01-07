class MemoGrid {

    modalTimer = null

    constructor(container,data, options = {}) {
        this.container = container;
        this.data = data;
        this.years = options.years || 60; // 默认为60年
        this.startDate = options.startDate || new Date().getFullYear() - this.years / 2;
        this.endDate = this.startDate + this.years;

    }

    render() {
        // 清空容器
        this.container.innerHTML = '';

        const grid = document.createElement('div');
        this.gridContainer = grid;
        grid.style.display = 'flex';
        grid.style.flexWrap = 'wrap';
        grid.style.gap = '0.25rem';
        grid.style.width = '100%';
        grid.style.height = '100%';
        grid.style.overflowY = 'auto';
        grid.style.padding = '2px';
        // 创建网格
        for (let year = this.startDate; year < this.endDate; year++) {
            for (let month = 1; month <= 12; month++) {
                // 创建单个格子
                const cell = document.createElement('div');
                const label = document.createElement('div');
                label.style.fontSize = '0.6rem';
                label.style.lineHeight = '0.5rem';
                label.textContent = " ";
                const box = document.createElement('div');
                cell.style.minWidth = '5px';
                cell.style.flexBasis = "auto";
                cell.style.flexGrow = "1";
                cell.style.flexShrink = "1";
                box.style.width = 'fit-content';
                box.style.lineHeight = "1.5rem";
                box.style.whiteSpace = 'nowrap'
                box.style.border = '1px solid #ccc';
                box.dataset.year = year;
                box.dataset.month = month.toString();
                const memo = this.getMemoByDate(year, month);
                if (memo) {
                    box.textContent = memo.title;
                    cell.addEventListener('mouseenter', () => {
                        if (this.modalTimer) {
                            clearTimeout(this.modalTimer);
                        }
                        this.createModel(cell,memo,'mouseenter');
                    })
                    label.textContent = `${year}.${month}`;
                } else {
                    label.style.minHeight = "0.5rem";
                    box.style.minHeight = "1.5rem";
                    box.style.width = '1.25rem';
                }
                cell.appendChild(label);
                cell.appendChild(box);
                // 添加到容器
                grid.appendChild(cell);
            }
        }

        // 可以在这里添加其他逻辑，例如绑定事件等

        this.container.appendChild(grid);
    }


    getMemoByDate(year,month) {
        if (this.data && this.data.length > 0) {
            return this.data.find(memo => {
                let startDate = new Date(memo.start);
                return startDate.getFullYear() === year && startDate.getMonth() + 1 === month;
            });
        }
        return null;
    }


    createModel(cell,memo,trigger = 'mouseenter') {
        if (trigger === 'mouseenter') {
            // 如果已经存在model，就删除
            const model = document.getElementById('memo-model');
            if (model) {
                model.parentNode.removeChild(model);
            }
            // 创建model
            const modelDiv = document.createElement('div');
            modelDiv.id = 'memo-model';
            modelDiv.style.position = 'absolute';
            modelDiv.style.zIndex = '1000';
            modelDiv.style.backgroundColor = '#fff';
            modelDiv.style.border = '1px solid #ccc';
            modelDiv.style.borderRadius = '5px';
            modelDiv.style.padding = '5px';
            const containerWidth = this.container.offsetWidth; // 获取容器的宽度
            const aspectRatio = 4 / 6;
            const modalWidth = containerWidth * 0.9; // 宽度为容器宽度的90%
            const modalHeight = modalWidth * aspectRatio; // 高度根据宽高比自动计算
            modelDiv.style.width = `${modalWidth}px`;
            modelDiv.style.height = `${modalHeight}px`;
            modelDiv.style.left = (containerWidth - modalWidth) / 2 + 'px';
            modelDiv.style.overflowY = 'auto';
            // top设置为cell下方,需要考虑到滚动后的top值,如果model的高度超过容器就放在cell的上面
            let top = cell.offsetTop + cell.offsetHeight - this.gridContainer.scrollTop;
            if (top + modalHeight > this.gridContainer.offsetHeight) {
                top = cell.offsetTop  - modalHeight - 12 - this.gridContainer.scrollTop;
            }
            // 如果设置为上方后还是超过容器就放在容器的顶部
            if (top < this.gridContainer.offsetTop) {
                top = this.gridContainer.offsetTop;
            }
            modelDiv.style.top = top + "px";
            modelDiv.style.display = 'flex';
            modelDiv.style.flexDirection = 'column';
            modelDiv.style.flexWrap = 'nowrap';
            modelDiv.style.alignItems = 'center';
            modelDiv.style.justifyContent = 'center';
            modelDiv.style.gap = '5px';

            const imageDiv = document.createElement('div');
            imageDiv.style.width = "96%";
            imageDiv.style.height = modalHeight * 0.8 + 'px';
            imageDiv.style.padding = '5px';
            const image = document.createElement('img');
            image.style.width = '100%';
            image.style.height = '100%';
            image.style.objectFit = 'fill';
            image.src = memo.image;

            const contentDiv = document.createElement('div');
            contentDiv.style.width = "96%";
            contentDiv.style.height = modalHeight * 0.2 + 'px';
            contentDiv.style.padding = '5px';
            const content = document.createElement('div');
            content.textContent = memo.content;
            content.style.fontSize = '0.8rem';
            contentDiv.appendChild(content);

            imageDiv.appendChild(image);
            // 添加到model
            modelDiv.appendChild(imageDiv);
            modelDiv.appendChild(contentDiv);
            // 添加到body
            this.container.appendChild(modelDiv);
            // 绑定事件 如果在model中或者在model中的内部元素中就改为移出model再移除
            const that = this;
            cell.addEventListener("mouseleave", function() {
                that.modalTimer = setTimeout(function() {
                    modelDiv.parentNode.removeChild(modelDiv);
                }, 300); // 延迟300毫秒


            });




        }
    }
}

export default MemoGrid;
