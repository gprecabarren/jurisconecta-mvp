UPDATE users SET password_hash = CASE id
  WHEN 'lawyer-maria-recabarren' THEN 'pbkdf2$10000$J_eEEIV9WNUQ0rJU8IQDqw$rBGuz1blHBBvgbUZnNS_trdiRWae2PPVkFwgNtAdQxs'
  WHEN 'lawyer-pablo-martin' THEN 'pbkdf2$10000$dvYzFJjAlRAlHlj3QjP9uQ$2_RhAUFBomFeqyKers3a6ub7E5Sa8wcCN7gUJ-L70Jc'
  WHEN 'lawyer-camila-fuentes' THEN 'pbkdf2$10000$QFtNQwq8cTyW_hjnNvckpg$3Hio78WVBZXRbt2CdB1WA3TEXUzMZk5L_0K0fYixXes'
  WHEN 'person-cliente-prueba' THEN 'pbkdf2$10000$2PWazggT6DxC0b2gOJd4AQ$Jkg2Yd2qTajFeObeKDaKqMvwzYoTLLb7tkAkeGeBi0k'
  ELSE password_hash
END
WHERE id IN ('lawyer-maria-recabarren', 'lawyer-pablo-martin', 'lawyer-camila-fuentes', 'person-cliente-prueba');
