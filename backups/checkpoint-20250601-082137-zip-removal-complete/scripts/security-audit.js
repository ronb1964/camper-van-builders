#!/usr/bin/env node

/**
 * Security audit script for Camper Van Builders application
 * This script runs npm audit and provides a formatted report of vulnerabilities
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}=== Camper Van Builders Security Audit ===${colors.reset}\n`);
console.log(`${colors.blue}Running audit at ${new Date().toISOString()}${colors.reset}\n`);

try {
  // Run npm audit in JSON format
  console.log(`${colors.cyan}Running npm audit...${colors.reset}`);
  const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
  
  // Parse the JSON output
  const auditData = JSON.parse(auditOutput);
  
  // Check if there are vulnerabilities
  if (auditData.vulnerabilities && Object.keys(auditData.vulnerabilities).length > 0) {
    console.log(`\n${colors.red}⚠️ Vulnerabilities found:${colors.reset}\n`);
    
    // Count vulnerabilities by severity
    const severityCounts = {
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      info: 0
    };
    
    // Process each vulnerability
    Object.values(auditData.vulnerabilities).forEach(vuln => {
      severityCounts[vuln.severity] = (severityCounts[vuln.severity] || 0) + 1;
      
      // Display vulnerability details
      const severityColor = 
        vuln.severity === 'critical' ? colors.red :
        vuln.severity === 'high' ? colors.magenta :
        vuln.severity === 'moderate' ? colors.yellow :
        vuln.severity === 'low' ? colors.blue : colors.green;
      
      console.log(`${severityColor}${vuln.severity.toUpperCase()}${colors.reset}: ${vuln.name}`);
      console.log(`  Vulnerable versions: ${vuln.range}`);
      console.log(`  Patched versions: ${vuln.fixAvailable ? vuln.fixAvailable.version : 'No fix available'}`);
      console.log(`  Dependency path: ${vuln.effects.join(' > ')}`);
      console.log(`  Recommendation: ${vuln.recommendation || 'Update to a patched version'}\n`);
    });
    
    // Summary of vulnerabilities
    console.log(`${colors.yellow}Summary:${colors.reset}`);
    Object.entries(severityCounts).forEach(([severity, count]) => {
      if (count > 0) {
        const severityColor = 
          severity === 'critical' ? colors.red :
          severity === 'high' ? colors.magenta :
          severity === 'moderate' ? colors.yellow :
          severity === 'low' ? colors.blue : colors.green;
        
        console.log(`  ${severityColor}${severity.toUpperCase()}${colors.reset}: ${count}`);
      }
    });
    
    // Save report to file
    const reportContent = JSON.stringify(auditData, null, 2);
    const reportPath = path.join(__dirname, 'security-audit-report.json');
    fs.writeFileSync(reportPath, reportContent);
    console.log(`\n${colors.green}Full report saved to ${reportPath}${colors.reset}`);
    
    // Provide fix command
    console.log(`\n${colors.cyan}To fix vulnerabilities, run:${colors.reset}`);
    console.log(`  npm audit fix`);
    console.log(`  # or for major version updates:`);
    console.log(`  npm audit fix --force ${colors.yellow}(use with caution)${colors.reset}\n`);
    
    process.exit(1); // Exit with error code if vulnerabilities found
  } else {
    console.log(`\n${colors.green}✓ No vulnerabilities found!${colors.reset}\n`);
  }
} catch (error) {
  console.error(`\n${colors.red}Error running security audit:${colors.reset}`);
  console.error(error.message);
  process.exit(1);
}
