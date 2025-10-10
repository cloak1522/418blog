const fs = require('fs-extra');
const path = require('path');

hexo.on('generateBefore', () => {
  const themeName = hexo.config.theme;
  const sourcePath = path.join(hexo.base_dir, 'node_modules', `hexo-theme-${themeName}`);
  const targetPath = path.join(hexo.base_dir, 'themes', themeName);

  // 检查源路径是否存在
  if (!fs.existsSync(sourcePath)) {
    hexo.log.error(`主题源路径不存在: ${sourcePath}`);
    return;
  }

  // 确保 themes 目录存在
  fs.ensureDirSync(path.join(hexo.base_dir, 'themes'));

  // 备份自定义配置文件
  const configPath = path.join(targetPath, '_config.yml');
  const customCssPath = path.join(hexo.base_dir, 'source', 'css', 'custom.css');
  let backupConfig = null;
  let hasCustomCss = false;

  if (fs.existsSync(configPath)) {
    try {
      backupConfig = fs.readFileSync(configPath, 'utf8');
      hexo.log.info('已备份主题配置文件');
    } catch (err) {
      hexo.log.warn(`备份配置文件失败: ${err.message}`);
    }
  }

  if (fs.existsSync(customCssPath)) {
    hasCustomCss = true;
    hexo.log.info('检测到自定义CSS文件');
  }

  // 清空目标目录（确保无残留冲突）
  if (fs.existsSync(targetPath)) {
    fs.removeSync(targetPath);
  }

  // 复制主题文件（含 source 资源）
  try {
    fs.copySync(sourcePath, targetPath, {
      overwrite: true,
      filter: (src, dest) => {
        // 排除嵌套的 node_modules，但允许主题根目录下的文件
        const relativePath = path.relative(sourcePath, src);
        const isNestedNodeModules = relativePath.includes('node_modules') && relativePath !== 'node_modules';
        return !isNestedNodeModules;
      }
    });
    
    // 验证复制是否成功
    if (fs.existsSync(targetPath)) {
      const files = fs.readdirSync(targetPath);
      hexo.log.info(`主题 ${themeName} 已成功复制到 themes 目录，包含 ${files.length} 个文件/目录`);
      
      // 恢复自定义配置
      if (backupConfig) {
        try {
          fs.writeFileSync(path.join(targetPath, '_config.yml'), backupConfig, 'utf8');
          hexo.log.info('已恢复自定义主题配置');
        } catch (err) {
          hexo.log.error(`恢复配置文件失败: ${err.message}`);
        }
      }
      
      // 提示自定义CSS文件位置
      if (hasCustomCss) {
        hexo.log.info('自定义CSS文件位于 source/css/custom.css，请确保在主题配置中正确引用');
      }
    } else {
      hexo.log.error(`主题复制失败：目标目录不存在`);
    }
  } catch (err) {
    hexo.log.error(`复制主题失败: ${err.message}`);
    hexo.log.error(`源路径: ${sourcePath}`);
    hexo.log.error(`目标路径: ${targetPath}`);
  }
});
