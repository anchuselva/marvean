-- ============================================================================
-- MARVEAN AI Market & Competitive Intelligence Platform
-- Database Schema: logicstrand_marvean
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `strategic_insights`;
DROP TABLE IF EXISTS `evidence_items`;
DROP TABLE IF EXISTS `signal_history`;
DROP TABLE IF EXISTS `market_signals`;
DROP TABLE IF EXISTS `comparison_history`;
DROP TABLE IF EXISTS `product_comparison_attributes`;
DROP TABLE IF EXISTS `product_comparisons`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `market_record_history`;
DROP TABLE IF EXISTS `market_sources`;
DROP TABLE IF EXISTS `market_records`;
DROP TABLE IF EXISTS `competitor_updates`;
DROP TABLE IF EXISTS `competitors`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- 1. Users Table (Authentication, User Management, Roles)
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'analyst', 'viewer') NOT NULL DEFAULT 'analyst',
  `status` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  `last_login_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Competitors Table (3.1 Competitor Management)
-- ----------------------------------------------------------------------------
CREATE TABLE `competitors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `ticker` VARCHAR(20) NULL,
  `tier` ENUM('Tier-1 Direct', 'Tier-2 Emerging', 'Indirect Threat', 'Strategic Partner') NOT NULL DEFAULT 'Tier-1 Direct',
  `category` VARCHAR(100) NOT NULL,
  `website` VARCHAR(255) NULL,
  `market_cap` VARCHAR(50) NULL,
  `headquarters` VARCHAR(120) NULL,
  `threat_level` ENUM('Critical', 'High', 'Moderate', 'Low') NOT NULL DEFAULT 'High',
  `status` ENUM('Active Tracking', 'Under Audit', 'Archived') NOT NULL DEFAULT 'Active Tracking',
  `overview` TEXT NOT NULL,
  `created_by` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_comp_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Competitor Updates Table (3.1 Track Profile Updates / Historical Logs)
-- ----------------------------------------------------------------------------
CREATE TABLE `competitor_updates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `competitor_id` INT NOT NULL,
  `user_id` INT NULL,
  `update_type` VARCHAR(80) NOT NULL,
  `change_field` VARCHAR(80) NOT NULL DEFAULT 'General Profile',
  `summary` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cu_competitor` FOREIGN KEY (`competitor_id`) REFERENCES `competitors`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cu_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Market Records Table (3.2 Market Records)
-- ----------------------------------------------------------------------------
CREATE TABLE `market_records` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `industry` VARCHAR(120) NOT NULL,
  `confidence_score` DECIMAL(4,1) NOT NULL DEFAULT 98.5,
  `classification` ENUM('SEC Filing', 'Patent Registry', 'Direct Pricing Audit', 'Industry Benchmark', 'Earnings Call Telemetry') NOT NULL DEFAULT 'Industry Benchmark',
  `executive_summary` TEXT NOT NULL,
  `deep_analysis` MEDIUMTEXT NULL,
  `status` ENUM('Published', 'Draft', 'Under Peer Review') NOT NULL DEFAULT 'Published',
  `created_by` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_mr_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Market Sources Table (3.2 Source Association)
-- ----------------------------------------------------------------------------
CREATE TABLE `market_sources` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `market_record_id` INT NOT NULL,
  `source_name` VARCHAR(200) NOT NULL,
  `source_type` VARCHAR(100) NOT NULL,
  `source_url` VARCHAR(255) NULL,
  `citation_key` VARCHAR(80) NULL,
  `verification_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ms_record` FOREIGN KEY (`market_record_id`) REFERENCES `market_records`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Market Record History (3.2 Historical Records)
-- ----------------------------------------------------------------------------
CREATE TABLE `market_record_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `market_record_id` INT NOT NULL,
  `user_id` INT NULL,
  `revision_number` INT NOT NULL DEFAULT 1,
  `change_summary` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_mrh_record` FOREIGN KEY (`market_record_id`) REFERENCES `market_records`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mrh_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Products Table (3.3 Product Comparisons)
-- ----------------------------------------------------------------------------
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `competitor_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `pricing_model` VARCHAR(100) NOT NULL DEFAULT 'Annual Contract / Seat',
  `pricing_tier` VARCHAR(100) NOT NULL DEFAULT '$5,000 / month',
  `status` ENUM('Active', 'Beta', 'Legacy', 'Deprecated') NOT NULL DEFAULT 'Active',
  `feature_summary` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_prod_competitor` FOREIGN KEY (`competitor_id`) REFERENCES `competitors`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Product Comparisons Table (3.3 Product Comparisons)
-- ----------------------------------------------------------------------------
CREATE TABLE `product_comparisons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `target_product_id` INT NULL,
  `category` VARCHAR(100) NOT NULL,
  `status` ENUM('Active Brief', 'Quarterly Review', 'Archived') NOT NULL DEFAULT 'Active Brief',
  `notes` TEXT NULL,
  `created_by` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pc_target_prod` FOREIGN KEY (`target_product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pc_user` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 9. Product Comparison Attributes Table (3.3 Comparison Attributes)
-- ----------------------------------------------------------------------------
CREATE TABLE `product_comparison_attributes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `comparison_id` INT NOT NULL,
  `attribute_name` VARCHAR(150) NOT NULL,
  `marvean_metric` VARCHAR(255) NOT NULL,
  `competitor_metric` VARCHAR(255) NOT NULL,
  `advantage` ENUM('Marvean', 'Competitor', 'Parity') NOT NULL DEFAULT 'Marvean',
  `audit_note` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pca_comp` FOREIGN KEY (`comparison_id`) REFERENCES `product_comparisons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 10. Comparison History Table (3.3 Comparison History)
-- ----------------------------------------------------------------------------
CREATE TABLE `comparison_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `comparison_id` INT NOT NULL,
  `user_id` INT NULL,
  `action` VARCHAR(100) NOT NULL,
  `notes` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ch_comp` FOREIGN KEY (`comparison_id`) REFERENCES `product_comparisons`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ch_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 11. Market Signals Table (3.4 Signal Tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE `market_signals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `competitor_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` ENUM('Pricing Shift', 'Product Launch', 'Patent Filing', 'Executive Move', 'M&A / Partnership', 'Regulatory Action') NOT NULL,
  `severity` ENUM('Critical', 'High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
  `status` ENUM('Active Alert', 'Under Review', 'Verified', 'Archived') NOT NULL DEFAULT 'Active Alert',
  `shift_latency` VARCHAR(50) NOT NULL DEFAULT '< 15m',
  `confidence` DECIMAL(4,1) NOT NULL DEFAULT 99.4,
  `details` TEXT NOT NULL,
  `source_tag` VARCHAR(100) NOT NULL DEFAULT 'SEC Edgar Ingestion',
  `created_by` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sig_competitor` FOREIGN KEY (`competitor_id`) REFERENCES `competitors`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sig_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 12. Signal History Table (3.4 Signal History)
-- ----------------------------------------------------------------------------
CREATE TABLE `signal_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `signal_id` INT NOT NULL,
  `user_id` INT NULL,
  `previous_status` VARCHAR(50) NOT NULL,
  `new_status` VARCHAR(50) NOT NULL,
  `notes` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sh_signal` FOREIGN KEY (`signal_id`) REFERENCES `market_signals`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sh_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 13. Evidence Items Table (3.5 Evidence Management)
-- ----------------------------------------------------------------------------
CREATE TABLE `evidence_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `evidence_type` ENUM('SEC Filing (10-K/10-Q)', 'Patent Registry Audit', 'Direct Pricing Audit', 'Antitrust / Legal Record', 'Earnings Telemetry Transcript') NOT NULL,
  `document_reference` VARCHAR(200) NOT NULL,
  `verification_hash` VARCHAR(64) NOT NULL,
  `verified_at` DATETIME NOT NULL,
  `summary` TEXT NOT NULL,
  `created_by` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_evi_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 14. Strategic Insights Table (3.5 Strategic Insight Records)
-- ----------------------------------------------------------------------------
CREATE TABLE `strategic_insights` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `competitor_id` INT NULL,
  `evidence_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `recommendation` TEXT NOT NULL,
  `strategic_horizon` ENUM('Immediate (0-30d)', 'Tactical (1-6mo)', 'Strategic (6-18mo)') NOT NULL DEFAULT 'Tactical (1-6mo)',
  `impact_rating` ENUM('Critical Advantage', 'High Impact', 'Moderate Impact', 'Observation Only') NOT NULL DEFAULT 'High Impact',
  `status` ENUM('Active Brief', 'Executive Delivered', 'Archived') NOT NULL DEFAULT 'Active Brief',
  `created_by` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_si_competitor` FOREIGN KEY (`competitor_id`) REFERENCES `competitors`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_si_evidence` FOREIGN KEY (`evidence_id`) REFERENCES `evidence_items`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_si_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 15. Activity Logs Table (Historical Activity & Audit Trail)
-- ----------------------------------------------------------------------------
CREATE TABLE `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `action` VARCHAR(80) NOT NULL,
  `entity_type` VARCHAR(80) NOT NULL,
  `entity_id` INT NOT NULL,
  `description` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_al_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA: Realistic Enterprise Intelligence Records
-- ============================================================================

-- 1. Default Admin & Analyst Users (Password for both: password123)
-- Hash generated via password_hash('password123', PASSWORD_BCRYPT)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`) VALUES
(1, 'Marvean Admin', 'admin@marvean.net', '$2y$10$yNr1t6HGq2tC8j7tTyFpfuZIU/Wflp2tlbRl1h5F1WjXLBfRT..dq', 'admin', 'active'),
(2, 'Chief Intel Analyst', 'analyst@marvean.net', '$2y$10$yNr1t6HGq2tC8j7tTyFpfuZIU/Wflp2tlbRl1h5F1WjXLBfRT..dq', 'analyst', 'active'),
(3, 'Executive Viewer', 'executive@marvean.net', '$2y$10$yNr1t6HGq2tC8j7tTyFpfuZIU/Wflp2tlbRl1h5F1WjXLBfRT..dq', 'viewer', 'active');

-- 2. Competitors
INSERT INTO `competitors` (`id`, `name`, `ticker`, `tier`, `category`, `website`, `market_cap`, `headquarters`, `threat_level`, `status`, `overview`, `created_by`) VALUES
(1, 'Nexus Enterprise Inc.', 'NXUS', 'Tier-1 Direct', 'Enterprise Commerce Intelligence', 'https://nexus-enterprise.io', '$18.4B', 'San Francisco, CA', 'Critical', 'Active Tracking', 'Major market share holder in global retail and B2B pricing optimization. Transitioning to predictive supply chain models.', 1),
(2, 'OmniRadar Systems', 'OMRD', 'Tier-1 Direct', 'Market Signal Tracking', 'https://omnidar.com', '$9.2B', 'New York, NY', 'High', 'Active Tracking', 'Specializes in real-time pricing bots and distributor telemetry. High latency on unstructured regulatory filings.', 1),
(3, 'Apex Market Intelligence', 'APEX', 'Tier-2 Emerging', 'Competitive AI Analytics', 'https://apexintel.ai', '$3.1B', 'Austin, TX', 'Moderate', 'Active Tracking', 'Emerging AI startup backed by sovereign funds. Developing transformer models for patent portfolio tracking.', 2),
(4, 'QuantEdge Dynamics', 'QED', 'Indirect Threat', 'Algorithmic Financial Telemetry', 'https://quantedge.com', '$42.0B', 'London, UK', 'Moderate', 'Active Tracking', 'Financial markets data aggregator expanding into enterprise SaaS commercial signals and vendor procurement monitoring.', 2);

-- 3. Competitor Profile Updates
INSERT INTO `competitor_updates` (`competitor_id`, `user_id`, `update_type`, `change_field`, `summary`) VALUES
(1, 1, 'Pricing Revision', 'APAC Pricing Tier', 'Competitor Nexus dropped Enterprise Tier by 15% across Tokyo and Singapore regions to capture mid-market accounts.'),
(1, 2, 'Executive Move', 'Executive Suite', 'Nexus poached Chief AI Scientist Dr. Aris Thorne from MIT CSAIL to lead new synthetic intelligence division.'),
(2, 2, 'M&A Activity', 'Asset Acquisition', 'OmniRadar acquired SignalForge for $120M in stock and cash to patch telemetry gaps in EU retail monitoring.');

-- 4. Market Records
INSERT INTO `market_records` (`id`, `title`, `industry`, `confidence_score`, `classification`, `executive_summary`, `deep_analysis`, `status`, `created_by`) VALUES
(1, 'Global Enterprise Commerce Pricing Compression Analysis Q3/Q4', 'Enterprise SaaS & Commerce', 99.4, 'Direct Pricing Audit', 'Audit across 14,000 enterprise SKU endpoints indicates 12.8% price compression in AI infrastructure licenses.', 'Extensive telemetry scraping across SEC 10-Q disclosures reveals vendor discounting reaching all-time highs as mid-tier providers struggle with customer retention.', 'Published', 1),
(2, 'APAC Telemetry Disruption & Autonomous Ingestion Radar', 'Global Trade & Logistics', 98.7, 'Industry Benchmark', 'Signal latency across cross-border freight routes has dropped from 48h to sub-15m through automated satellite AIS feeds.', 'Commercial competitors relying on traditional batch ETL are suffering 14-hour blind spots in dynamic rate adjustments.', 'Published', 2),
(3, 'Patent Landscape: Transformer NLP for Antitrust & Mergers', 'AI & Legal Intelligence', 96.9, 'Patent Registry', '32 new patents granted to competitive intelligence providers targeting automatic SEC Form 8-K sentiment extraction.', 'Evaluation of USPTO filings shows aggressive land-grab for algorithmic detection of hidden affiliate pricing pacts.', 'Published', 2);

-- 5. Market Sources
INSERT INTO `market_sources` (`market_record_id`, `source_name`, `source_type`, `source_url`, `citation_key`, `verification_date`) VALUES
(1, 'U.S. Securities & Exchange Commission (EDGAR)', 'SEC 10-Q Regulatory Filing', 'https://www.sec.gov/edgar/searchedgar/companysearch', 'SEC-2026-Q3-0941', '2026-09-28'),
(1, 'Direct Pricing Audit Telemetry Engine', 'Automated Pricing Scraper', 'https://audit.marvean.net/telemetry/sku-884', 'PRC-AUD-4402', '2026-10-01'),
(2, 'Singapore Maritime & Port Authority Feed', 'Government Port Authority Telemetry', 'https://mpa.gov.sg/port-data', 'MPA-SG-FEED-2026', '2026-09-30'),
(3, 'USPTO Patent Full-Text Database', 'Patent Office Examination Record', 'https://patft.uspto.gov', 'US-PAT-1189420-B2', '2026-09-25');

-- 6. Market Record History
INSERT INTO `market_record_history` (`market_record_id`, `user_id`, `revision_number`, `change_summary`) VALUES
(1, 1, 1, 'Initial creation and peer review signoff by Chief Intel Analyst.'),
(1, 1, 2, 'Added direct telemetry citations from 14 APAC pricing endpoints.'),
(2, 2, 1, 'Baseline intelligence publication following automated satellite ingestion.');

-- 7. Products
INSERT INTO `products` (`id`, `competitor_id`, `name`, `category`, `pricing_model`, `pricing_tier`, `status`, `feature_summary`) VALUES
(1, 1, 'Nexus Commerce Core', 'Enterprise Intelligence Suite', 'Annual Contract', '$12,500 / month', 'Active', 'Centralized catalog intelligence with 24h batch update latency. Heavy reliance on manual analyst briefings.'),
(2, 1, 'Nexus PriceScout', 'Dynamic Pricing Telemetry', 'Per-Endpoint Consumption', '$4,200 / month', 'Active', 'Automated web crawler for competitor price monitoring. Lacks SEC filing evidence verification.'),
(3, 2, 'OmniRadar Enterprise', 'Real-Time Market Feeds', 'Seat-based License', '$8,900 / month', 'Active', 'Telemetry dashboard covering e-commerce SKU changes with moderate latency (15-45 mins).');

-- 8. Product Comparisons
INSERT INTO `product_comparisons` (`id`, `title`, `target_product_id`, `category`, `status`, `notes`, `created_by`) VALUES
(1, 'MARVEAN Command Center vs. Nexus Commerce Core', 1, 'Enterprise AI Market Intel', 'Active Brief', 'Key evaluation matrix used in Fortune 500 competitive takeout briefings.', 1),
(2, 'MARVEAN Signal Engine vs. OmniRadar Enterprise', 3, 'Real-Time Telemetry & Radar', 'Quarterly Review', 'Direct shootout highlighting Marvean sub-15m latency advantage and SEC evidence governance.', 2);

-- 9. Product Comparison Attributes
INSERT INTO `product_comparison_attributes` (`comparison_id`, `attribute_name`, `marvean_metric`, `competitor_metric`, `advantage`, `audit_note`) VALUES
(1, 'Signal Ingestion Latency', '< 15 Minutes (Continuous Stream)', '4 - 12 Hours (Batch ETL)', 'Marvean', 'Benchmarked against SEC Form 8-K filings on Oct 2026.'),
(1, 'Evidence Governance Standard', 'Cryptographically Audited SEC/USPTO Hash', 'Unverified Web Scraping', 'Marvean', 'Patent-pending SHA256 audit trail.'),
(1, 'Pricing Model Transparency', 'Predictable Flat Enterprise Tier ($3,500/mo)', 'Opaque Quoted Pricing ($12,500/mo+)', 'Marvean', 'Eliminates predatory per-seat markups.'),
(1, 'Autonomous Decision Matrix', 'Native AI NLP Verification Engine', 'Manual Analyst Review Required', 'Marvean', 'Reduces strategic response cycle by 84%.'),
(2, 'Multi-Source Signal Synthesis', 'Full SEC, Patents, Pricing, Court & Telemetry', 'Pricing & Public Catalog Only', 'Marvean', 'Comprehensive multi-modal synthesis.');

-- 10. Comparison History
INSERT INTO `comparison_history` (`comparison_id`, `user_id`, `action`, `notes`) VALUES
(1, 1, 'Attribute Updated', 'Updated latency metric following Q3 verification testing.'),
(1, 2, 'Review Signoff', 'Approved comparison matrix for executive briefing distribution.');

-- 11. Market Signals
INSERT INTO `market_signals` (`id`, `competitor_id`, `title`, `category`, `severity`, `status`, `shift_latency`, `confidence`, `details`, `source_tag`, `created_by`) VALUES
(1, 1, 'Competitor Nexus dropped Enterprise Tier by 15% in APAC', 'Pricing Shift', 'Critical', 'Active Alert', '< 12m', 99.4, 'Automated scraper identified price reduction on Nexus enterprise rate card across Tokyo, Singapore and Sydney endpoints.', 'Direct Pricing Audit', 1),
(2, 2, 'OmniRadar CEO sold 45,000 shares in Form 4 SEC Filing', 'Executive Move', 'High', 'Verified', '< 8m', 99.8, 'SEC Form 4 filing detected under 8 minutes from filing window. Represents 32% of personal holdings.', 'SEC Edgar Automated Feed', 2),
(3, 3, 'Apex Market Intelligence filed broad patent on Multi-Agent Market Scraping', 'Patent Filing', 'Medium', 'Under Review', '< 15m', 96.5, 'USPTO application 2026/0199411 covers recursive crawler architecture using synthetic proxy pools.', 'USPTO Registry Radar', 2),
(4, 1, 'Nexus Enterprise announced strategic alliance with EuroCommerce Cloud', 'M&A / Partnership', 'High', 'Verified', '< 14m', 99.1, 'Joint go-to-market agreement targeting top 500 retail chains across DACH region.', 'Public Regulatory Disclosure', 1);

-- 12. Signal History
INSERT INTO `signal_history` (`signal_id`, `user_id`, `previous_status`, `new_status`, `notes`) VALUES
(1, 1, 'Ingested', 'Active Alert', 'Flagged as Critical Severity due to direct overlap with top accounts.'),
(2, 2, 'Active Alert', 'Verified', 'Cross-referenced against SEC Edgar official Form 4 filing signature.');

-- 13. Evidence Items
INSERT INTO `evidence_items` (`id`, `title`, `evidence_type`, `document_reference`, `verification_hash`, `verified_at`, `summary`, `created_by`) VALUES
(1, 'Nexus Enterprise Inc. Q3 2026 Form 10-Q Filing', 'SEC Filing (10-K/10-Q)', 'SEC-EDGAR-0001844910-26-000042', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '2026-09-30 14:22:00', 'Discloses 18% increase in sales incentive provisions in Asia-Pacific and contract churn of 4.2%.', 1),
(2, 'USPTO Patent Grant US-1189420-B2: Autonomous Competitive Signal Pipeline', 'Patent Registry Audit', 'USPTO-PAT-US-1189420-B2', '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069', '2026-09-22 09:15:00', 'Legal patent claim verification for real-time natural language query ingestion across distributed commerce endpoints.', 2),
(3, 'APAC Direct Pricing Telemetry Audit Cryptographic Manifest', 'Direct Pricing Audit', 'AUDIT-LOG-2026-APAC-8841', 'c2d4b1fa3d677284addd200126d9069e3b0c44298fc1c149afbf4c8996fb924', '2026-10-01 18:40:00', 'Raw HTTP response hashes, TLS cert validation, and timestamped proof of competitor tier price drop.', 1);

-- 14. Strategic Insights
INSERT INTO `strategic_insights` (`id`, `competitor_id`, `evidence_id`, `title`, `recommendation`, `strategic_horizon`, `impact_rating`, `status`, `created_by`) VALUES
(1, 1, 1, 'Counter Nexus APAC Price Drop with Value-Guaranteed Multi-Year Lock', 'Deploy targeted competitive briefing to top 20 APAC accounts emphasizing Marvean sub-15m latency and zero-seat pricing versus Nexus degraded service.', 'Immediate (0-30d)', 'Critical Advantage', 'Active Brief', 1),
(2, 2, 2, 'Accelerate Patent Offensive on Cross-Border Real-time Telemetry', 'File continuation applications against OmniRadar patent claims using earlier priority dates established in Marvean research logs.', 'Tactical (1-6mo)', 'High Impact', 'Active Brief', 2),
(3, 3, 3, 'Preempt Apex Market Intelligence Startup Funding Narrative', 'Publish open benchmark demonstrating Marvean 99.4% audited accuracy versus competitor hallucination rates on unstructured disclosures.', 'Tactical (1-6mo)', 'High Impact', 'Active Brief', 2);

-- 15. Activity Logs
INSERT INTO `activity_logs` (`user_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`) VALUES
(1, 'DATABASE_INIT', 'System', 1, 'Initialized logicstrand_marvean intelligence database schema with full enterprise modules.', '127.0.0.1'),
(1, 'CREATE_RECORD', 'Competitor', 1, 'Created profile for Nexus Enterprise Inc.', '127.0.0.1'),
(1, 'DISPATCH_ALERT', 'MarketSignal', 1, 'Critical Pricing Alert dispatched to executive subscriber pool.', '127.0.0.1'),
(2, 'VERIFY_EVIDENCE', 'EvidenceItem', 1, 'Verified cryptographic hash for SEC 10-Q filing.', '127.0.0.1');
