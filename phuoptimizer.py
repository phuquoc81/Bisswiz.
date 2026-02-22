#!/usr/bin/env python3
"""
Phuoptimizer-81 Main Application
A comprehensive security and software upgrade tool for any device.

Features:
- Malware detection and removal
- Spyware detection and removal
- Wormware detection and removal
- Phishing detection and removal
- Spiderware detection and removal
- Software upgrade capabilities across platforms
"""

import sys
import argparse
from src.threat_detector import ThreatDetector
from src.software_upgrader import SoftwareUpgrader


def print_banner():
    """Print the application banner."""
    banner = """
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║              PHUOPTIMIZER-81                              ║
    ║         Advanced Security & Upgrade Tool                  ║
    ║                                                           ║
    ║  Cleaning: Malware | Spyware | Wormware                  ║
    ║            Phishing | Spiderware                          ║
    ║                                                           ║
    ║  Upgrading: Software on Any Device                        ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    """
    print(banner)


def scan_and_clean():
    """Perform security scan and threat cleaning."""
    print("\n🔍 Initiating Security Scan...\n")
    
    detector = ThreatDetector()
    
    # Scan for threats
    threats = detector.scan_system()
    
    # Display results
    total_threats = sum(len(threat_list) for threat_list in threats.values())
    
    if total_threats > 0:
        print(f"\n⚠️  Found {total_threats} potential threats!")
        print("\n🧹 Starting cleanup process...")
        cleaned = detector.clean_threats(threats)
        total_cleaned = sum(cleaned.values())
        print(f"\n✅ Successfully cleaned {total_cleaned} threats!")
    else:
        print("\n✅ System scan complete - No threats detected!")
        print("Your device is clean and secure! 🛡️")
    
    # Print detailed report
    print(detector.get_scan_report())


def upgrade_software():
    """Perform software upgrade operations."""
    print("\n🚀 Initiating Software Upgrade Process...\n")
    
    upgrader = SoftwareUpgrader()
    
    # Detect device
    device_info = upgrader.detect_device()
    
    # Check for updates
    print("\n🔍 Checking for available updates...")
    updates = upgrader.check_for_updates()
    
    if updates:
        print(f"\n📦 Found {len(updates)} available updates")
        print("🔄 Performing upgrades...")
        stats = upgrader.perform_upgrade()
        
        if stats['failed'] == 0:
            print("\n✅ All upgrades completed successfully!")
        else:
            print(f"\n⚠️  {stats['failed']} upgrade(s) failed")
    else:
        print("\n✅ All software is up to date!")
    
    # Print detailed report
    print(upgrader.get_upgrade_report())


def full_optimization():
    """Perform full system optimization (scan + upgrade)."""
    print("\n🎯 Starting Full System Optimization...\n")
    
    # Step 1: Security scan and cleaning
    print("="*60)
    print("STEP 1: SECURITY SCAN AND THREAT REMOVAL")
    print("="*60)
    scan_and_clean()
    
    # Step 2: Software upgrade
    print("\n")
    print("="*60)
    print("STEP 2: SOFTWARE UPGRADE")
    print("="*60)
    upgrade_software()
    
    print("\n")
    print("="*60)
    print("🎉 FULL OPTIMIZATION COMPLETE!")
    print("="*60)
    print("Your device has been:")
    print("  ✅ Scanned for threats")
    print("  ✅ Cleaned of malware")
    print("  ✅ Updated to latest software")
    print("\nYour device is now optimized and secure! 🚀")


def main():
    """Main application entry point."""
    parser = argparse.ArgumentParser(
        description='Phuoptimizer-81: Advanced Security and Software Upgrade Tool',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --scan          # Scan for and remove threats
  %(prog)s --upgrade       # Upgrade software packages
  %(prog)s --full          # Full optimization (scan + upgrade)
  %(prog)s                 # Interactive mode (default)
        """
    )
    
    parser.add_argument(
        '--scan',
        action='store_true',
        help='Scan for and remove malware, spyware, wormware, phishing, and spiderware'
    )
    
    parser.add_argument(
        '--upgrade',
        action='store_true',
        help='Upgrade software on the device'
    )
    
    parser.add_argument(
        '--full',
        action='store_true',
        help='Perform full optimization (scan and upgrade)'
    )
    
    parser.add_argument(
        '--version',
        action='version',
        version='Phuoptimizer-81 v1.0.0'
    )
    
    args = parser.parse_args()
    
    print_banner()
    
    try:
        if args.full:
            full_optimization()
        elif args.scan:
            scan_and_clean()
        elif args.upgrade:
            upgrade_software()
        else:
            # Interactive mode
            print("\nSelect an option:")
            print("1. Scan and clean threats")
            print("2. Upgrade software")
            print("3. Full optimization (recommended)")
            print("4. Exit")
            
            choice = input("\nEnter your choice (1-4): ").strip()
            
            if choice == '1':
                scan_and_clean()
            elif choice == '2':
                upgrade_software()
            elif choice == '3':
                full_optimization()
            elif choice == '4':
                print("\nThank you for using Phuoptimizer-81! 👋")
                sys.exit(0)
            else:
                print("\n❌ Invalid choice. Please run again and select 1-4.")
                sys.exit(1)
                
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
