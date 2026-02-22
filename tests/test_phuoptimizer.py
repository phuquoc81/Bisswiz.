"""
Test suite for Phuoptimizer-81
Basic tests for threat detection and software upgrade functionality.
"""

import unittest
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.threat_detector import ThreatDetector
from src.software_upgrader import SoftwareUpgrader


class TestThreatDetector(unittest.TestCase):
    """Test cases for ThreatDetector class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.detector = ThreatDetector()
    
    def test_initialization(self):
        """Test ThreatDetector initialization."""
        self.assertIsNotNone(self.detector)
        self.assertIsInstance(self.detector.threat_signatures, dict)
        self.assertIn('malware', self.detector.threat_signatures)
        self.assertIn('spyware', self.detector.threat_signatures)
        self.assertIn('wormware', self.detector.threat_signatures)
        self.assertIn('phishing', self.detector.threat_signatures)
        self.assertIn('spiderware', self.detector.threat_signatures)
    
    def test_scan_system_returns_dict(self):
        """Test that scan_system returns a dictionary."""
        result = self.detector.scan_system()
        self.assertIsInstance(result, dict)
        self.assertEqual(len(result), 5)
    
    def test_scan_system_has_all_threat_types(self):
        """Test that scan result contains all threat types."""
        result = self.detector.scan_system()
        self.assertIn('malware', result)
        self.assertIn('spyware', result)
        self.assertIn('wormware', result)
        self.assertIn('phishing', result)
        self.assertIn('spiderware', result)
    
    def test_clean_threats_empty(self):
        """Test cleaning with no threats."""
        threats = {
            'malware': [],
            'spyware': [],
            'wormware': [],
            'phishing': [],
            'spiderware': []
        }
        result = self.detector.clean_threats(threats)
        self.assertIsInstance(result, dict)
        self.assertEqual(sum(result.values()), 0)
    
    def test_clean_threats_with_threats(self):
        """Test cleaning with threats present."""
        threats = {
            'malware': ['threat1', 'threat2'],
            'spyware': ['threat3'],
            'wormware': [],
            'phishing': [],
            'spiderware': []
        }
        result = self.detector.clean_threats(threats)
        self.assertEqual(result['malware'], 2)
        self.assertEqual(result['spyware'], 1)
        self.assertEqual(sum(result.values()), 3)
    
    def test_get_scan_report(self):
        """Test scan report generation."""
        self.detector.scan_system()
        report = self.detector.get_scan_report()
        self.assertIsInstance(report, str)
        self.assertIn('PHUOPTIMIZER-81', report)
        self.assertIn('THREAT SCAN REPORT', report)


class TestSoftwareUpgrader(unittest.TestCase):
    """Test cases for SoftwareUpgrader class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.upgrader = SoftwareUpgrader()
    
    def test_initialization(self):
        """Test SoftwareUpgrader initialization."""
        self.assertIsNotNone(self.upgrader)
        self.assertIsNotNone(self.upgrader.system)
        self.assertIsNotNone(self.upgrader.machine)
    
    def test_detect_device_returns_dict(self):
        """Test that detect_device returns a dictionary."""
        result = self.upgrader.detect_device()
        self.assertIsInstance(result, dict)
        self.assertIn('system', result)
        self.assertIn('machine', result)
        self.assertIn('platform', result)
    
    def test_detect_device_has_required_fields(self):
        """Test that device info has all required fields."""
        result = self.upgrader.detect_device()
        required_fields = ['system', 'machine', 'platform', 
                          'processor', 'python_version', 'architecture']
        for field in required_fields:
            self.assertIn(field, result)
            self.assertIsNotNone(result[field])
    
    def test_check_for_updates_returns_list(self):
        """Test that check_for_updates returns a list."""
        result = self.upgrader.check_for_updates()
        self.assertIsInstance(result, list)
    
    def test_perform_upgrade_empty(self):
        """Test upgrade with no packages."""
        result = self.upgrader.perform_upgrade([])
        self.assertIsInstance(result, dict)
        self.assertEqual(result['attempted'], 0)
    
    def test_perform_upgrade_with_packages(self):
        """Test upgrade with packages."""
        packages = ['package1', 'package2']
        result = self.upgrader.perform_upgrade(packages)
        self.assertIsInstance(result, dict)
        self.assertEqual(result['attempted'], 2)
        self.assertIn('successful', result)
        self.assertIn('failed', result)
    
    def test_get_upgrade_report(self):
        """Test upgrade report generation."""
        self.upgrader.check_for_updates()
        report = self.upgrader.get_upgrade_report()
        self.assertIsInstance(report, str)
        self.assertIn('PHUOPTIMIZER-81', report)
        self.assertIn('UPGRADE REPORT', report)


class TestIntegration(unittest.TestCase):
    """Integration tests for the complete system."""
    
    def test_full_scan_and_clean_workflow(self):
        """Test the complete scan and clean workflow."""
        detector = ThreatDetector()
        
        # Scan for threats
        threats = detector.scan_system()
        self.assertIsInstance(threats, dict)
        
        # Clean threats
        cleaned = detector.clean_threats(threats)
        self.assertIsInstance(cleaned, dict)
        
        # Generate report
        report = detector.get_scan_report()
        self.assertIsInstance(report, str)
    
    def test_full_upgrade_workflow(self):
        """Test the complete upgrade workflow."""
        upgrader = SoftwareUpgrader()
        
        # Detect device
        device_info = upgrader.detect_device()
        self.assertIsInstance(device_info, dict)
        
        # Check for updates
        updates = upgrader.check_for_updates()
        self.assertIsInstance(updates, list)
        
        # Generate report
        report = upgrader.get_upgrade_report()
        self.assertIsInstance(report, str)


if __name__ == '__main__':
    unittest.main()
